#!/usr/bin/env python3
"""Build native Japanese centerlines from the JP face of Noto Sans CJK Regular."""

import argparse
import json
from collections import defaultdict
from math import dist, hypot
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

SIDE = 66
INSET = 6
OFFSETS = ((0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1), (-1, 0), (-1, 1))


def thin(ink):
    """Zhang–Suen thinning with a clear outer border."""
    while True:
        removed = False
        for phase in (0, 1):
            neighbors = [np.roll(ink, (-dy, -dx), axis=(0, 1)) for dy, dx in OFFSETS]
            degree = sum(point.astype(np.uint8) for point in neighbors)
            turns = sum((~point & neighbors[(index + 1) % 8]).astype(np.uint8)
                        for index, point in enumerate(neighbors))
            east, _, south, _, west, _, north, _ = neighbors
            triples = ((north & east & south) | (east & south & west)) if phase == 0 else (
                (north & east & west) | (north & south & west))
            erase = ink & (degree >= 2) & (degree <= 6) & (turns == 1) & ~triples
            if erase.any():
                ink[erase] = False
                removed = True
        if not removed:
            return ink


def trace(ink):
    pixels = {(int(x), int(y)) for y, x in np.argwhere(ink)}
    graph = defaultdict(list)
    for x, y in sorted(pixels):
        for dy, dx in OFFSETS:
            other = (x + dx, y + dy)
            if other not in pixels:
                continue
            # Omit a diagonal shortcut around a bend.
            if dx and dy and ((x + dx, y) in pixels or (x, y + dy) in pixels):
                continue
            graph[x, y].append(other)

    nodes = sorted(pixels, key=lambda p: (len(graph[p]) == 2, p[1], p[0]))
    visited = set()
    for start in nodes:
        if not graph[start]:
            yield [start]
        for neighbor in graph[start]:
            if (start, neighbor) in visited:
                continue
            path = [start, neighbor]
            while True:
                before, end = path[-2:]
                visited.update(((before, end), (end, before)))
                if len(graph[end]) != 2 or end == start:
                    break
                path.append(next(point for point in graph[end] if point != before))
            # Short tips at junctions are artifacts of thinning thick outlines.
            endpoint_degrees = sorted((len(graph[path[0]]), len(graph[path[-1]])))
            if len(path) <= 4 and endpoint_degrees[0] == 1 and endpoint_degrees[1] >= 3:
                continue
            yield path


def simplify(points):
    if len(points) < 3:
        return points
    ax, ay = points[0]
    bx, by = points[-1]
    length = hypot(bx - ax, by - ay)
    distances = [
        abs((bx - ax) * (ay - y) - (by - ay) * (ax - x)) / length
        if length else dist((ax, ay), (x, y))
        for x, y in points[1:-1]
    ]
    peak = max(distances)
    if peak < 1.6:
        return [points[0], points[-1]]
    split = distances.index(peak) + 1
    return simplify(points[:split + 1])[:-1] + simplify(points[split:])


def image_for(character, font):
    image = Image.new('L', (SIDE, SIDE))
    ImageDraw.Draw(image).text((INSET, INSET), character, font=font, fill=255, anchor='lt')
    return np.array(image) >= 128


def characters():
    selected = set('々〆〇ーゝゞヽヾ𠮷髙')
    selected.update(chr(code) for code in range(0x3041, 0x3100) if chr(code).isalpha())
    for row in range(0xB0, 0xF5):
        for column in range(0xA1, 0xFF):
            try:
                character = bytes((row, column)).decode('euc_jp')
            except UnicodeDecodeError:
                continue
            if character.isalpha():
                selected.add(character)
    return sorted(selected)


def centerlines(font):
    missing = image_for(chr(0x10FFFF), font)
    for character in characters():
        ink = image_for(character, font)
        if not ink.any() or np.array_equal(ink, missing):
            continue
        paths = []
        for stroke in trace(thin(ink)):
            points = simplify(stroke)
            if len(points) == 1:
                x, y = points[0]
                points = [(x, y - 1), (x, y + 1)]
            if len(set(points)) < 2:
                continue
            paths.append(''.join(
                f'{x:02x}{y:02x}' for x, y in points
            ))
        if paths:
            yield character, ' '.join(paths)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('font', type=Path, help='Noto Sans CJK Regular TTC (JP face first)')
    parser.add_argument('output', type=Path, help='output JSON path')
    args = parser.parse_args()
    font = ImageFont.truetype(str(args.font), 50, index=0)
    assert font.getname() == ('Noto Sans CJK JP', 'Regular'), font.getname()
    data = dict(centerlines(font))
    args.output.write_text(
        '{\n' + ',\n'.join(
            json.dumps(character, ensure_ascii=False) + ':' + json.dumps(strokes)
            for character, strokes in data.items()
        ) + '\n}\n',
        encoding='utf-8',
    )
    print(f'{len(data)} characters -> {args.output}')


if __name__ == '__main__':
    main()

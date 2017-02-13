import sys
import json
from pprint import pprint
import re
import os

colors = [
    "0024FE",
    "2721EC",
    "4E1ED2",
    "721DB2",
    "931E95",
    "B12174",
    "D02350",
    "EA2530",
    "FD2E08",
    "CE4711",
    "957324",
    "519D38",
    "00C949",
    "03D581",
    "00E4AF",
    "01F2DA",
    "01FFFF",
    "00E6FE",
    "02CDFE",
    "07AFFE",
    "0094FF",
    "0177FE",
    "0058FD",
    "0039FF",
]


def newKML(place, clusterStyles):
    kml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<kml xmlns="http://www.opengis.net/kml/2.2"><Document>',
        clusterStyles,
        place,
        '</Document></kml>'
    ]
    return "\n".join(kml)


def newPlace(name, coords):
    polygon = newPolygon(coords)
    place = [
        '<Placemark>',
        '<name>%s</name>' % name,
        '<styleUrl>#%s</styleUrl>' % name,
        polygon,
        '</Placemark>',
    ]
    return "\n".join(place)


def newPolygon(coords):
    polygon = [
        '<Polygon>',
        '<outerBoundaryIs>',
        '<LinearRing>',
        '<coordinates>%s</coordinates>' % coords,
        '</LinearRing>',
        '</outerBoundaryIs>',
        '</Polygon>'
    ]
    return "\n".join(polygon)


def calcWidthAndHeight(southWest, northEast, divideSize):
    height = (northEast["lat"] - southWest["lat"]) / divideSize
    width = (northEast["lng"] - southWest["lng"]) / divideSize
    return width, height


def calcMatrixIndex(n, divideSize):
    i = n % divideSize
    j = n / divideSize
    return i, j


def calcPolygonCoords(northEast, width, height, i, j):
    NE = calcGridEdge(northEast, width, height, i, j)
    SE = calcGridEdge(northEast, width, height, i, j+1)
    SW = calcGridEdge(northEast, width, height, i+1, j+1)
    NW = calcGridEdge(northEast, width, height, i+1, j)
    coords = [
        "%f, %f" % NE,
        "%f, %f" % SE,
        "%f, %f" % SW,
        "%f, %f" % NW,
    ]

    return "\n".join(coords)


def calcGridEdge(northEast, width, height, i, j):
    coord = (
        northEast["lng"] - width*i,
        northEast["lat"] - height*j,
    )
    return coord


def clusterStyle(i, color):
    style = [
        "<Style id='cluster-%d'>" % i,
        "<PolyStyle>",
        "<color>",
        "7f" + color,
        "</color>",
        "</PolyStyle>",
        "</Style>"
    ]

    return "\n".join(style)



def main():
    targetDir = "data/output/d5/Result/"
    clustersFile = targetDir + "clusters.csv"
    settingFile = targetDir + "setting.json"
    print "Target dir is", targetDir

    with open(settingFile, "r") as f:
        grid = json.load(f)["grid"]
        southWest = grid["southWest"]
        northEast = grid["northEast"]
        divideSize = grid["divideSize"]

    clusters = []
    with open(clustersFile, "r") as f:
        for line in f.readlines():
            clusters.append(int(line))

    places = []
    width, height = calcWidthAndHeight(southWest, northEast, divideSize)
    for n, clusterIndex in enumerate(clusters):
        if clusterIndex == 0:
            continue
        i, j = calcMatrixIndex(n, divideSize)
        name = "cluster-" + str(clusterIndex-1)
        coords = calcPolygonCoords(northEast, width, height, i, j)
        places.append(newPlace(name, coords))

    styles = "\n".join([clusterStyle(i, color) for i, color in enumerate(colors)])
    with open("data/middle/grids.kml", "w+") as f:
        kml = newKML("\n".join(places), styles)
        f.write(kml)


if __name__ == "__main__":
    main()

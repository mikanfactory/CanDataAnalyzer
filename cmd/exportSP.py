import sys
import json
from pprint import pprint
import re
import os


def newKML(place):
    kml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<kml xmlns="http://www.opengis.net/kml/2.2"><Document>',
        place,
        '</Document></kml>'
    ]
    return "\n".join(kml)


def newPlace(name, coord):
    point = newPoint(*coord)
    place = [
        '<Placemark>',
        '<name>%s</name>' % name,
        point,
        '</Placemark>',
    ]
    return "\n".join(place)


def newPoint(lng, lat):
    point = [
        '<Point>',
        '<coordinates>%f,%f</coordinates>' % (lat, lng),
        '</Point>'
    ]
    return "\n".join(point)


def main():
    if len(sys.argv) < 2:
        print "Please specify target csv file"
        return

    target = sys.argv[1]
    print "Target file is", target

    with open(target, "r") as f:
        raw = json.load(f)

    places = []
    for place in raw:
        image = re.findall("\w*.png", place["image"])[0]
        state = os.path.splitext(image)[0]
        lat, lng = place["position"]["lat"], place["position"]["lng"]
        places.append(newPlace(state, [lat, lng]))

    with open("data/middle/switching_point.kml", "w+") as f:
        kml = newKML("\n".join(places))
        f.write(kml)


if __name__ == "__main__":
    main()

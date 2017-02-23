import pandas as pd
import json

def colmunName(df, cacheConfig, name):
    for columns in cacheConfig["columns"]:
        if columns["Name"] == name:
            return df.columns[columns["Index"]]


def brakeName(df, cacheConfig):
    return colmunName(df, cacheConfig, "Brake")


def accelName(df, cacheConfig):
    return colmunName(df, cacheConfig, "Accel")


def updateCSV(fname, cacheConfig):
    fname = "data/original/%s.csv" % target
    outname = "data/input/%s.csv" % target
    print "converting %s..." % fname

    df = pd.read_csv(fname)
    BRAKE = brakeName(df, cacheConfig)
    ACCEL = accelName(df, cacheConfig)

    bthreshold = 1
    df.ix[df[BRAKE] < bthreshold, BRAKE] = 0
    df.ix[df[BRAKE] >= bthreshold, BRAKE] = 0

    athreshold = 0
    df.ix[df[ACCEL] < athreshold, ACCEL] = 0
    df.ix[df[ACCEL] >= athreshold, ACCEL] = 0

    df.to_csv(outname, index=False)


if __name__ == "__main__":
    with open("config/targets.json") as f:
        tconfig = json.load(f)

    with open("config/cacheConfig.json", "r") as f:
        cacheConfig = json.load(f)

    # Update csv
    targets = tconfig["names"]
    for target in targets:
        updateCSV(target, cacheConfig)

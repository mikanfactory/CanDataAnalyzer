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
    df = pd.read_csv(fname)
    BRAKE = brakeName(df, cacheConfig)
    ACCEL = accelName(df, cacheConfig)

    bthreshold = 1
    brakeZeros = df[BRAKE] < bthreshold
    brakeOnes = df[BRAKE] >= bthreshold
    df.ix[brakeZeros, BRAKE] = 0
    df.ix[brakeOnes, BRAKE] = 1

    athreshold = 0
    accelZeros = df[ACCEL] < athreshold
    accelOnes = df[ACCEL] >= athreshold
    df.ix[accelZeros, ACCEL] = 0
    df.ix[accelOnes, ACCEL] = 1

    df.to_csv(fname, index=False)


if __name__ == "__main__":
    with open("config/targets.json") as f:
        tconfig = json.load(f)

    with open("config/cacheConfig.json", "r") as f:
        cacheConfig = json.load(f)

    # Update csv
    targets = tconfig["names"]
    for target in targets:
        fname = "data/original/%s.csv" % target
        print "converting %s..." % fname
        updateCSV(fname, cacheConfig)

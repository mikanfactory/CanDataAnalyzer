import pandas as pd
import os
import glob


if __name__ == "__main__":
    files = glob.glob('data/csv/*.csv')
    for file in files:
        basename = os.path.basename(file)
        name, _ = os.path.splitext(basename)

        tdf = pd.read_table("data/tsv/%s.tsv" % name)
        tdf = tdf.ix[1:]

        cdf = pd.read_csv("data/csv/%s.csv" % name)
        cdf = cdf.ix[1:]

        df = pd.concat([tdf, cdf], axis=1)
        df.to_csv("data/original/%s.csv" % name, index=False)

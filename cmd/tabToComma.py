import pandas as pd
import os
import glob


if __name__ == "__main__":
    files = glob.glob('cmd/tmp/*.txt')
    for file in files:
        path, _ = os.path.splitext(file)

        df = pd.read_table(file)
        df = df.ix[1:]
        df.to_csv(path + ".csv", index=False)

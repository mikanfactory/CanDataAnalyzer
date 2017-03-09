import pandas as pd


def main():
    df = pd.read_csv("./data/middle/sp.csv")
    df = df[["Target", "Time", "Longitude", "Latitude", "flag"]]
    df.columns = [["Target", "Time", "Longitude", "Latitude", "Flag"]]
    df.to_csv("./data/middle/check.csv")


if __name__ == '__main__':
    main()

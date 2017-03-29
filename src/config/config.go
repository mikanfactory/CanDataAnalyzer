package config

import (
	"fmt"
	"log"

	"github.com/BurntSushi/toml"
)

type Config struct {
	App     App
	DB      DB
	Command Command
}

type App struct {
	GoogleMapKey string  `toml:"google_map_key"`
	AnalysisDir  string  `toml:"analysis_dir"`
	GridSize     int     `toml:"grid_size"`
	ColorMax     float64 `toml:"color_max"`
}

type DB struct {
	Pass string `toml:"pass"`
}

type Command struct {
	SegmentSize int `toml:"segment_size"`
}

func LoadConfig() *Config {
	c := &Config{}
	_, err := toml.DecodeFile("config/config.toml", c)
	if err != nil {
		log.Fatalf("cannot open configuration file. exit. %s", err)
	}

	return c
}

func (m *DB) MysqlConf(dest string) string {
	return fmt.Sprintf("root:%s@/%s", m.Pass, dest)
}

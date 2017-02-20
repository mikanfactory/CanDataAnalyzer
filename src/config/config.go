package config

import (
	"log"

	"github.com/BurntSushi/toml"
)

type Config struct {
	GoogleMap GoogleMap
	Cluster   Cluster
}

type GoogleMap struct {
	Key string
}

type Cluster struct {
	Dir string
}

func LoadConfig() *Config {
	c := &Config{}
	_, err := toml.DecodeFile("config/config.toml", c)
	if err != nil {
		log.Fatalf("cannot open configuration file. exit. %s", err)
	}

	return c
}

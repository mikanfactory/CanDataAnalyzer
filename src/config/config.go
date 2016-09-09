package config

import (
	"log"

	"github.com/BurntSushi/toml"
)

type Config struct {
	GoogleMap GoogleMap
}

type GoogleMap struct {
	Key string
}

func LoadConfig() *Config {
	c := &Config{}
	_, err := toml.DecodeFile("config/config.toml", c)
	if err != nil {
		log.Fatalf("cannot open configuration file. exit. %s", err)
	}

	return c
}

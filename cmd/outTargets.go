package main

import (
	"encoding/json"
	"io/ioutil"
	"path/filepath"
	"regexp"
	"strings"
)

type Targets struct {
	Names []string `json:"names"`
}

func main() {
	g := regexp.MustCompile(`\.gitkeep$`)
	d := regexp.MustCompile(`\.DS_Store`)
	c := regexp.MustCompile(`.*cache.*`)

	files, _ := ioutil.ReadDir("../data")
	targets := []string{}
	for _, file := range files {
		name := file.Name()
		res := c.MatchString(name) ||
			d.MatchString(name) ||
			g.MatchString(name)

		if !res {
			target := strings.TrimSuffix(name, filepath.Ext(name))
			targets = append(targets, target)
		}
	}

	t := &Targets{Names: targets}
	json, _ := json.Marshal(t)
	ioutil.WriteFile("../config/targets.json", json, 0744)
}

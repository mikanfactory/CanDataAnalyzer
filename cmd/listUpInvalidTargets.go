package cmd

import (
	"encoding/json"
	"io/ioutil"
	"path/filepath"
	"reflect"
	"regexp"
	"strings"
)

func ListUpInvalidTargets() {
	g := regexp.MustCompile(`\.gitkeep$`)
	d := regexp.MustCompile(`\.DS_Store`)
	c := regexp.MustCompile(`.*cache.*`)

	file, err := ioutil.ReadFile("config/cacheConfigT.json")
	checkErr(err)

	cacheInfo := &CacheInfo{}
	err = json.Unmarshal(file, cacheInfo)
	checkErr(err)

	files, _ := ioutil.ReadDir("data/original")
	targets := []string{}
	for _, file := range files {
		name := file.Name()
		res := c.MatchString(name) || d.MatchString(name) || g.MatchString(name)

		if !res && isInvalidTarget(name, *cacheInfo) {
			target := strings.TrimSuffix(name, filepath.Ext(name))
			targets = append(targets, target)
		}
	}

	t := &Targets{Names: targets}
	json, _ := json.Marshal(t)
	ioutil.WriteFile("config/invalidTargets.json", json, 0744)
}

func isInvalidTarget(name string, validCacheInfo CacheInfo) bool {
	// target cache info
	c := extractHeader(name)

	if reflect.DeepEqual(c, validCacheInfo) {
		return false
	}

	return true
}

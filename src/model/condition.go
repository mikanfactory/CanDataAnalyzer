package model

import "strings"

func (m *Condition) UpdateContent() {
	m.Content = strings.Replace(m.Content, "==", "=", -1)
}

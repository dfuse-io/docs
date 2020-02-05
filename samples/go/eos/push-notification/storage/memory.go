package storage

import msignotify "github.com/dfuse-io/example-push-notifications"

type MemoryStorage struct {
	devicesTokens map[string]*msignotify.DeviceToken
	lastCursor    string
}

func NewMemoryStorage() *MemoryStorage {
	return &MemoryStorage{
		devicesTokens: map[string]*msignotify.DeviceToken{},
	}
}

func (s *MemoryStorage) OptInDeviceToken(eosAccountName string, deviceToken string, deviceType int) {
	s.devicesTokens[eosAccountName] = &msignotify.DeviceToken{DeviceType: deviceType, Token: deviceToken}
}

func (s *MemoryStorage) OptOuDeviceToken(deviceToken string) {
	panic("implement me")
}

func (s *MemoryStorage) FindDeviceToken(eosAccountName string) *msignotify.DeviceToken {
	return s.devicesTokens[eosAccountName]
}

func (s *MemoryStorage) StoreCursor(cursor string) {
	s.lastCursor = cursor
}

func (s *MemoryStorage) LoadCursor() string {
	return s.lastCursor
}

package msignotify

type Storage interface {
	OptInDeviceToken(eosAccountName string, deviceToken string, deviceType int)
	OptOuDeviceToken(deviceToken string)
	FindDeviceToken(eosAccountName string) *DeviceToken
	StoreCursor(cursor string)
	LoadCursor() string
}

package msignotify

const (
	IOS = iota
	ANDROID
)

type DeviceToken struct {
	DeviceType int
	Token      string
}

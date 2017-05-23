DISK=`/usr/bin/hdiutil attach -nobrowse -nomount ram://1048576`

/usr/sbin/diskutil erasevolume HFS+ "RamDiskCache" $DISK

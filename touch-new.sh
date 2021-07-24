for file in `git  st | grep "\.js" | grep -v "\-dist" | sed s/.*modified:\ *//`
do
  touch $file
  sleep 1
done

#!/bin/sh

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
DAEMON=/usr/local/bin/node
FILE=/srv/api/roadtripper-api/bin/www
FULLCMD="usr/local/bin/node /srv/api/roadtripper-api/bin/www"
DESC=api
APINAME=roadtripper

NAME=node
PIDFILE=/srv/api/roadtripper-api/bin/$NAME.pid

. /lib/lsb/init-functions

STARTTIME=1
DIETIME=10

DAEMONUSER=roadtripper-api
DAEMONGROUP=roadtripper

set -e

running_pid() {
    #Check if process is running
    pid=$1
    name=$2
    [ -z "$pid" ] && return 1   #Check if string is empty
    [ ! -d /proc/$pid ] && return 1 #Check if process exist
    cmd=`cat /proc/$pid/cmdline | tr "\000" "\n"|head -n 1 |cut -d : -f 1`

    [ "$cmd" != "$name" ] &&  return 1 #Check if process is same as daemon
    return 0
}

running() {
# Check if the process is running looking at /proc
# (works for all users)

    # No pidfile, probably no daemon present
    [ ! -f "$PIDFILE" ] && return 1
    pid=`cat $PIDFILE`
    running_pid $pid $DAEMON || return 1
    return 0
}

start_server() {

    # Start the process using the wrapper
    start-stop-daemon --background  --start --pidfile $PIDFILE \
       --make-pidfile --chuid $DAEMONUSER:$DAEMONGROUP \
       --exec $DAEMON $FILE
    errcode=$?
    return $errcode
}

stop_server() {
    # Stop the process using the wrapper
    start-stop-daemon --stop --quiet --pidfile $PIDFILE \
       --retry 300 \
       --user $DAEMONUSER \
       --exec $DAEMON
    errcode=$?
    return $errcode
}

case "$1" in

    start)
        log_daemon_msg "Starting $DESC" "$APINAME"

        #Check if api is running
        if running ; then
            log_progress_msg "apparently already running"
            log_end_msg 0
            exit 0
        fi

        if start_server ; then

            [ -n "$STARTTIME" ] && sleep $STARTTIME #Wait some time
            if running ; then #Check if api still running
                log_end_msg 0
            else
                log_end_msg 1
            fi
        else
            log_end_msg 1
        fi
        ;;

    stop)
        log_daemon_msg "Stopping $DESC" "$APINAME"
        if running ; then #Check if server is running
            errcode=0
            stop_server || errcode=$?
            log_end_msg $errcode
        else
            log_progress_msg "apparently not running"
            log_end_msg 0
            exit 0
        fi
        ;;

    restart)
        log_daemon_msg "Restarting $DESC" "$APINAME"
        errcode=0
        stop_server || errcode=$? #Stop server

        [ -n "$DIETIME" ] && sleep $DIETIME #Wait
        start_server || errcode=$? #Start server
        [ -n "$STARTTIME" ] && sleep $STARTTIME
        running || errcode=$?
        log_end_msg $errcode
        ;;

    status)
        log_daemon_msg "Checking status of $DESC"
        if running ; then
            log_progress_msg "running"
            log_end_msg 0
        else
            log_progress_msg "apparently not running"
            log_end_msg 1
            exit 1
        fi
        ;;
esac

exit 0

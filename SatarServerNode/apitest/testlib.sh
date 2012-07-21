# usleep() like in c but in shell using perl's select()
function usleep() {
    perl -e "select(undef,undef,undef,$1)"
}

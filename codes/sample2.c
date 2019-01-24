#include<stdio.h>
int main(){

    int a = 5;
    int b = 3;
    int tmp;

    tmp = b;
    b = a;
    a = tmp;

    printf("a = %d\n", a);
    printf("b = %d\n", b);

    return 0;
}

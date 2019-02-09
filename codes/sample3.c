#include<stdio.h>
int main(void){

    int number;
    int digit = 0;

    printf("Input number : ");
    scanf("%d", &number);

    while(number != 0){
        number = number / 10;
        ++digit;
    }

    printf("Digit : %d", digit);

    return 0;
}

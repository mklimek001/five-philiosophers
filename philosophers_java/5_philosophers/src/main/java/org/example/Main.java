package org.example;

import version0.Table0;
import version1.Table1;
import version2.Table2;
import version3.Table3;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) throws InterruptedException {

        Scanner myInput = new Scanner( System.in );
        System.out.print( "Philosophers number: " );
        int phil_num = myInput.nextInt();

        System.out.print( "Meals number: " );
        int meals_num = myInput.nextInt();

        Table1.main(phil_num,meals_num);

        Table2.main(phil_num,meals_num);

        Table3.main(phil_num,meals_num);

        Table0.main(phil_num,meals_num);

    }
}
package version3;

import java.util.concurrent.Semaphore;
import static java.lang.Thread.sleep;


public class Table3 {
    public static void main(int phil_num, int meals_num) throws InterruptedException {
        Semaphore[] chopsticks = new Semaphore[phil_num];
        PhilosopherWithConductor[] philosophers = new PhilosopherWithConductor[phil_num];
        Semaphore arbitrator = new Semaphore(phil_num -1);
        double totalWaitingTime = 0;

        for(int i = 0; i < phil_num; i++){
            chopsticks[i] = new Semaphore(1);
        }

        for(int i = 0; i < phil_num; i++){
            philosophers[i] = new PhilosopherWithConductor(chopsticks[i% phil_num], chopsticks[(i+1)% phil_num], arbitrator, i, meals_num);
        }

        for(PhilosopherWithConductor philosopher: philosophers){
            philosopher.start();
        }


        for(PhilosopherWithConductor philosopher: philosophers){
            philosopher.join();
            totalWaitingTime += philosopher.getWaitingTime();
        }

        System.out.println(" ");
        System.out.println("     --- SUMMARY ---     ");
        System.out.println("    CONDUCTOR SOLUTION    ");
        System.out.println("Average waiting time : " + totalWaitingTime/(phil_num*meals_num));
        System.out.println("     ---------------   ");

        for(PhilosopherWithConductor philosopher: philosophers){
            philosopher.showStats();
        }

    }
}

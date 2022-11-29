package version2;


import java.util.concurrent.Semaphore;


public class Table2 {
    public static void main(int phil_num, int meals_num) throws InterruptedException {
        Semaphore[] chopsticks = new Semaphore[phil_num];
        PhilosopherAsym[] philosophers = new PhilosopherAsym[phil_num];
        double totalWaitingTime = 0;

        for(int i = 0; i < phil_num; i++){
            chopsticks[i] = new Semaphore(1);
        }

        for(int i = 0; i < phil_num; i++){
            philosophers[i] = new PhilosopherAsym(chopsticks[i% phil_num], chopsticks[(i+1)% phil_num], i, meals_num);
        }

        for(PhilosopherAsym philosopher: philosophers){
            philosopher.start();
        }

        for(PhilosopherAsym philosopher: philosophers){
            philosopher.join();
            totalWaitingTime += philosopher.getWaitingTime();
        }

        System.out.println(" ");
        System.out.println("     --- SUMMARY ---     ");
        System.out.println("    ASYMETRIC SOLUTION    ");
        System.out.println("Average waiting time : " + totalWaitingTime/(phil_num*meals_num));
        System.out.println("     ---------------   ");


        for(PhilosopherAsym philosopher: philosophers){
            philosopher.showStats();
        }





    }
}

package version1;


import java.util.Random;
import java.util.concurrent.Semaphore;

import static java.lang.System.currentTimeMillis;


public class PhilosopherParallel extends Thread{
    Semaphore left_chopstick;
    Semaphore right_chopstick;
    int id_number;
    int eaten = 0;
    int iterations;
    int rejections = 0;

    long waiting_time = 0;

    Random rand = new Random();

    public PhilosopherParallel(Semaphore l_chopstick,Semaphore r_chopstick, int id, int count){
        left_chopstick = l_chopstick;
        right_chopstick= r_chopstick;
        id_number = id;
        iterations = count;
    }

    private void eating() throws InterruptedException {
        System.out.println("Philosopher " + id_number + " is eating...");
        sleep(rand.nextInt(100));
        eaten+=1;
    }

    public void showStats(){
        System.out.println("Philosopher  : " + id_number);
        System.out.println("Eaten        : " + eaten);
        System.out.println("Rejected     : " + rejections);
        System.out.println("Waiting time : " + waiting_time);
        System.out.println("Average time : " + (double)waiting_time/eaten);
        System.out.println("     ---------------   ");
    }

    public double getWaitingTime(){
        return waiting_time;
    }

    public void run() {
        while(eaten < iterations) {
            try {
                sleep(rand.nextInt(100));
                long start = currentTimeMillis();
                long stop;
                right_chopstick.acquire();

                if (left_chopstick.tryAcquire()) {
                    stop = currentTimeMillis();
                    eating();
                    left_chopstick.release();
                }else{
                    stop = currentTimeMillis();
                    rejections+=1;
                }

                waiting_time += (stop - start);

                right_chopstick.release();

            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }

}

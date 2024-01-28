#include <LiquidCrystal.h>
#include <SoftwareSerial.h>
#include "melody_function.h"
#include "levels_function.h"

// Define all pin
#define SENSOR 2
#define BUZZER_PIN 12
#define RED1 14
#define RED2 15
#define YELLOW1 16
#define YELLOW2 17
#define GREEN 18

// SoftwareSerial for Bluetooth communication
SoftwareSerial bluetooth(10, 11); // RX, TX pins for HC-05 module 
LiquidCrystal lcd(8, 7, 6, 5, 4, 3); // LiquidCrystal for LCD display

float Main_intrrupt_count = 0.0;
float Speed_intrrupt_count = 0.0;

float l1=1.25,l2=2.5,l3=3.75,l4=5.0,l5=6.25,s;      
int age=12,t=6.25;// Initial age and threshold time

unsigned long blowStartTime=0;
const unsigned long blowStopinterval = 7000;// Time interval for the game
const unsigned long interval2 = 1500;// Time interval for the game over sound
String data;

static String receivedValueString = "";
int receivedValue = 0;
float l_hour;
unsigned long currentTime;
unsigned long cloopTime;

void setup() {
      Serial.begin(9600); // Initialize serial communication
      pinMode(BUZZER_PIN, OUTPUT);
      bluetooth.begin(9600);
      lcd.begin(16, 2);
      analogWrite(9, 0);
      lcd.setCursor(0, 0);
      lcd.print("   !!Welcome!!");
      lcd.setCursor(0, 1);
      lcd.print("    ENTER AGE");
      start(BUZZER_PIN  );// Play the starting melody
      pinMode(SENSOR, INPUT_PULLUP);// Set the blowing interrupt pin as an input with a pull-up resistor
      pinMode(RED1, OUTPUT);
      pinMode(RED2, OUTPUT);
      pinMode(YELLOW1, OUTPUT);
      pinMode(YELLOW2, OUTPUT);
      pinMode(GREEN, OUTPUT);
      attachInterrupt(digitalPinToInterrupt(2), InterruptFunction, RISING); // Attach the interrupt handler
      sei(); // Enable interrupts
      currentTime = millis();
      cloopTime = currentTime;
  }

   void resetgame()
  {
    analogWrite(9, 0);
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.setCursor(5, 0);
    lcd.print("AGE=");
    lcd.print(age);
    lcd.setCursor(0, 1);
    lcd.print("   NEXT TURN..!!       ");
    all_off(RED1,RED2,YELLOW1,YELLOW2,GREEN);
    Main_intrrupt_count= 0;
    s=0;
    blowStartTime = 0;
    l_hour=0; 
  }

void InterruptFunction(){
    Main_intrrupt_count ++;
    Speed_intrrupt_count ++;
 }

void loop(){
  
  currentTime = millis();
   // Every second, calculate and print litres/hour
   if(currentTime >= (cloopTime + 1000))
   {
      s = Main_intrrupt_count /340;
      float score = (100*s)/t;
      if (s < l2 && s >=l1) {
          level_1(RED1,RED2,YELLOW1,YELLOW2,GREEN);
         
      }
      else if (s < l3 && s >= l2) {
          level_2(RED1,RED2,YELLOW1,YELLOW2,GREEN) ;  
      }
      else if (s < l4 && s >= l3) {
          level_3(RED1,RED2,YELLOW1,YELLOW2,GREEN);
      }
      else if (s < l5 && s >= l4) {
          level_4(RED1,RED2,YELLOW1,YELLOW2,GREEN);
      }
      else if (s >= l5) {
          level_5(RED1,RED2,YELLOW1,YELLOW2,GREEN);
      }
      if(Main_intrrupt_count>=3 && Main_intrrupt_count<=20)// Start the timer for the game
      {
       Serial.print("into");
       blowStartTime = millis();
      }
      
      cloopTime = currentTime; // Updates cloopTime
      // Pulse frequency (Hz) = 7.5Q, Q is flow rate in L/min.
      l_hour = (Speed_intrrupt_count * 1 / 7.5); // (Pulse frequency x 60 min) / 7.5Q = flowrate in L/hour
      Speed_intrrupt_count = 0; // Reset Counter
      
      Serial.print(l_hour, DEC); // Print litres/hour
      Serial.println(" L/min");
      if(blowStartTime != 0 && (millis() - blowStartTime) > blowStopinterval && l_hour == 0 ) 
    {     
          over(BUZZER_PIN);// Play the game over melody
          resetgame(); // Reset the game state    
    } 
   }
 }
    

const int switch_pin1 = 2;
const int switch_pin2 = 3;
const int switch_pin3 = 4;
int switch_val1 = 0;
int switch_val2 = 0;
int switch_val3 = 0;

int active_switch = 0;

void setup() {
  // set pin as input
  pinMode(switch_pin1, INPUT);
  pinMode(switch_pin2, INPUT);
  pinMode(switch_pin3, INPUT);


  //initialize serial communication
  Serial.begin(9600);

}

void loop() {
  // put your main code here, to run repeatedly:

  switch_val1 = digitalRead(switch_pin1);
  switch_val2 = digitalRead(switch_pin2);
  switch_val3 = digitalRead(switch_pin3);

  //  Serial.println();
  //  Serial.println(switch_val1);
  //  Serial.println(switch_val2);
  //  Serial.println(switch_val3);


  // isolate the switch that was pressed
  // print the switch number to the screen
  // so p5 code knows which button was just pressed
  if (switch_val1 == 1 && active_switch != 1) {
    active_switch = 1;
    Serial.println(1);
  } else if (switch_val2 == 1 && active_switch != 2) {
    active_switch = 2;
    Serial.println(2);
  } else if (switch_val3 == 1 && active_switch != 3) {
    active_switch = 3;
    Serial.println(3);
  }

  delay(10);

}

// Example 1: Basic getter and setter
class User {
  private firstName: string;
  private lastName: string;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // This is a getter - it looks like a property but runs a function
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // This is a setter - it looks like property assignment but runs a function
  set fullName(value: string) {
    const [firstName, lastName] = value.split(' ');
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // This is a regular method - you need to call it with ()
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

// Example 2: Getter and setter with validation
class Temperature {
  private _celsius: number;

  constructor(celsius: number) {
    this._celsius = celsius;
  }

  // Getter for Celsius
  get celsius(): number {
    return this._celsius;
  }

  // Setter for Celsius with validation
  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error('Temperature cannot be below absolute zero');
    }
    this._celsius = value;
  }

  // Getter for Fahrenheit - computed from Celsius
  get fahrenheit(): number {
    return (this._celsius * 9) / 5 + 32;
  }

  // Setter for Fahrenheit - converts to Celsius
  set fahrenheit(value: number) {
    this._celsius = ((value - 32) * 5) / 9;
  }
}

// Example 3: Getter and setter with caching
class ExpensiveOperation {
  private _cachedResult: number | null = null;
  private _input: number = 0;

  get result(): number {
    if (this._cachedResult === null) {
      // Simulate expensive computation
      this._cachedResult = Math.random() * 100;
    }
    return this._cachedResult;
  }

  set input(value: number) {
    this._input = value;
    // Invalidate cache when input changes
    this._cachedResult = null;
  }
}

// Usage examples:
const user = new User('John', 'Doe');
console.log(user.fullName); // "John Doe" - using getter
user.fullName = 'Jane Smith'; // Using setter
console.log(user.fullName); // "Jane Smith"

const temp = new Temperature(25);
console.log(temp.celsius); // 25
console.log(temp.fahrenheit); // 77
temp.celsius = 30; // Using setter
console.log(temp.fahrenheit); // 86
temp.fahrenheit = 95; // Setting in Fahrenheit
console.log(temp.celsius); // 35

const expensive = new ExpensiveOperation();
console.log(expensive.result); // First call computes
console.log(expensive.result); // Second call uses cached value
expensive.input = 42; // Using setter invalidates cache
console.log(expensive.result); // New computation

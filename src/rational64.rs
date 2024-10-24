use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub struct Rational64(u64, u64);

#[wasm_bindgen]
impl Rational64 {
    pub fn new(numerator: u64, denominator: u64) -> Self {
        let gcd = Rational64::gcd(numerator, denominator);
        Rational64(numerator / gcd, denominator / gcd)
    }

    fn gcd(mut a: u64, mut b: u64) -> u64 {
        while b != 0 {
            let temp = b;
            b = a % b;
            a = temp;
        }
        a
    }

    pub fn to_f32(&self) -> f32 {
        self.0 as f32 / self.1 as f32
    }
}

impl std::ops::Add for Rational64 {
    type Output = Self;

    fn add(self, other: Self) -> Self {
        let numerator = self.0 * other.1 + other.0 * self.1;
        let denominator = self.1 * other.1;
        Rational64::new(numerator, denominator)
    }
}

impl std::ops::AddAssign for Rational64 {
    fn add_assign(&mut self, other: Self) {
        *self = *self + other;
    }
}

impl std::ops::Sub for Rational64 {
    type Output = Self;

    fn sub(self, other: Self) -> Self {
        let common_denominator = self.1 * other.1;
        let self_numerator = self.0 * other.1;
        let other_numerator = other.0 * self.1;

        if self_numerator >= other_numerator {
            Rational64::new(self_numerator - other_numerator, common_denominator)
        } else {
            // 結果が負になる場合、u64では表現できないのでpanicする
            panic!("Result would be negative, which is not supported with unsigned integers");
        }
    }
}

impl std::ops::SubAssign for Rational64 {
    fn sub_assign(&mut self, other: Self) {
        *self = *self - other;
    }
}

impl std::ops::Mul for Rational64 {
    type Output = Self;

    fn mul(self, other: Self) -> Self {
        let numerator = self.0 * other.0;
        let denominator = self.1 * other.1;
        Rational64::new(numerator, denominator)
    }
}

impl std::ops::MulAssign for Rational64 {
    fn mul_assign(&mut self, other: Self) {
        *self = *self * other;
    }
}

impl std::ops::Mul<Rational64> for u64 {
    type Output = u64;

    fn mul(self, rhs: Rational64) -> Self::Output {
        (self * rhs.0) / rhs.1
    }
}

impl std::ops::Div for Rational64 {
    type Output = Self;

    fn div(self, other: Self) -> Self {
        assert!(other.0 != 0, "Division by zero");
        let numerator = self.0 * other.1;
        let denominator = self.1 * other.0;
        Rational64::new(numerator, denominator)
    }
}

impl std::ops::DivAssign for Rational64 {
    fn div_assign(&mut self, other: Self) {
        assert!(other.0 != 0, "Division by zero");
        *self = *self / other;
    }
}

impl std::fmt::Display for Rational64 {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{}/{}", self.0, self.1)
    }
}

impl std::cmp::PartialEq for Rational64 {
    fn eq(&self, other: &Self) -> bool {
        self.0 * other.1 == self.1 * other.0
    }
}

impl std::cmp::PartialOrd for Rational64 {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        // a/b < c/d if and only if a*d < b*c
        (self.0 * other.1).partial_cmp(&(self.1 * other.0))
    }
}
mod rational64;
use rational64::*;

use wasm_bindgen::prelude::*;
use std::collections::HashMap;

struct Xorshift{
    seed: u64,
}

impl Xorshift{
    pub fn new(seed: u64) -> Self{
        Xorshift{
            seed,
        }
    }

    pub fn rand(&mut self) -> u64{
        self.seed ^= self.seed << 13;
        self.seed ^= self.seed >> 7;
        self.seed ^= self.seed << 17;
        self.seed
    }
}


#[wasm_bindgen]
#[derive(Clone, PartialEq)]
pub struct System{
    z: Vec<u64>,
    z_th: u64,
    trans_param: Vec<Rational64>,
    alpha: Rational64,
    beta: Rational64,
    sys_exp: u8,
    sys_len: usize,
    num_of_sites: usize,
    defect_idx: usize,
    size_count: Vec<u64>,
    // size_count[0]は使わない
}

#[wasm_bindgen]
impl System {
    pub fn new(seed: u64, alpha: f64, beta: f64) -> Self {
        let alpha: Rational64 = Self::f64_to_rational64(alpha);
        let beta: Rational64 = Self::f64_to_rational64(beta);

        let sys_exp: u8 = 8; // とりあえず256で固定
        let sys_len: usize = 1 << sys_exp;
        let num_of_sites: usize = sys_len * sys_len;

        let z_th: u64 = u64::MAX / 4;
        let mut z: Vec<u64> = Vec::with_capacity(num_of_sites);

        let mut xor: Xorshift = Xorshift::new(seed);

        for _ in 0..num_of_sites {
            z.push(xor.rand() % z_th);
        }

        let defect_idx: usize = (num_of_sites + sys_len) / 2;
        let mut trans_param: Vec<Rational64> = vec![alpha; num_of_sites];
        trans_param[defect_idx] = beta;

        let size_count: Vec<u64> = vec![0; num_of_sites + 1];

        System {
            z: z,
            z_th: z_th,
            trans_param: trans_param,
            alpha: alpha,
            beta: beta,
            sys_exp: sys_exp,
            sys_len: sys_len,
            num_of_sites: num_of_sites,
            defect_idx: defect_idx,
            size_count: size_count,
        }
    }

    fn f64_to_rational64(x: f64) -> Rational64{
        let large: u64 = 1 << 32;
        let numerator: u64 = (x * large as f64) as u64;
        Rational64::new(numerator, large)
    }

    // fn get_alpha(&self) -> f32{
    //     self.alpha.to_f32()
    // }

    // fn get_beta(&self) -> f32{
    //     self.beta.to_f32()
    // }

    // fn get_min_z(&self) -> u64{
    //     self.z.iter().fold(u64::MAX, |min, &val| min.min(val))
    // }
    
    fn get_max_z(&self) -> u64{
        self.z.iter().fold(u64::MIN, |max, &val| max.max(val))
    }

    

    pub fn update(&mut self){
        let mut stack: Vec<usize> = Vec::new();
        let mut add: HashMap<usize, u64> = HashMap::default();
        
        let mut size: usize = 0;

        // 時間発展させる
        let delta_z: u64 = self.z_th - self.get_max_z();
        self.z.iter_mut().for_each(|z| *z += delta_z);

        // epicenterの探索
        self.z.iter().enumerate()
            .filter(|(_, &z_i)| z_i >= self.z_th)
            .for_each(|(i, _)| {
                stack.push(i);
            });

        // toppling
        loop{
            while let Some(i) = stack.pop() {
                let z_i = self.z[i];
                if z_i >= self.z_th{
                    self.z[i] = 0;
                    let redist_val: u64 = z_i * self.trans_param[i];

                    let (x, y): (usize, usize) = (i % self.sys_len, i / self.sys_len);
                    *add.entry(self.sys_len * ((y + self.sys_len - 1) % self.sys_len) + x).or_insert(0u64) += redist_val;
                    *add.entry(self.sys_len * ((y + 1) % self.sys_len) + x).or_insert(0u64) += redist_val;
                    *add.entry(self.sys_len * y + (x + self.sys_len - 1) % self.sys_len).or_insert(0u64) += redist_val;
                    *add.entry(self.sys_len * y + (x + 1) % self.sys_len).or_insert(0u64) += redist_val;
                
                    size += 1;
                }
            }
            if add.is_empty(){
                break;
            }

            add.iter()
                .for_each(|(&idx, &add_i)| {
                    self.z[idx] += add_i;
                    stack.push(idx);
                });
            add.clear();
        }

        // サイズ頻度分布を更新
        self.size_count[size] += 1;
    }

    pub fn get_normalized_z(&self) -> Vec<u8> {
        let max_z: f64 = self.z_th as f64;
        self.z.iter().flat_map(|&value| {
            let r = 0u8;
            let g = 16u8;
            let b = 255 - (255.0 * (value as f64 / max_z)) as u8;
            vec![r, g, b, 255]
        }).collect()
    }

    pub fn get_size_distribution(&self) -> Vec<f64>{
        let sum: f64 = self.size_count.iter().sum::<u64>() as f64;
        self.size_count.iter().map(|&f|{
            f as f64 / sum
        }).collect()
    }

    pub fn reset_size_distribution(&mut self){
        self.size_count = vec![0; self.num_of_sites + 1];
    }
}

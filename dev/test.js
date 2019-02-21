const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();
bitcoin.createNewBlock(2389, "0YUSJHA973ASHA", "90SAJSASV6246ASHJ");
// bitcoin.createNewBlock(22329, "0YUDSDSDA7873ASHA", "73HJVDJAS893");
// bitcoin.createNewBlock(3784, "9023JSBFJSDKJ", "9382BDJFSDBHFJ");
bitcoin.crateNewTransaction(100, "ALEX89HJVDHAJVA786", "JEN65567ASGHAVGVDJV09");
bitcoin.createNewBlock(22329, "0YUDSDSDA7873ASHA", "73HJVDJAS893"); //mining of the block created above

bitcoin.crateNewTransaction(50, "JHAVSD7834KJD", "KJASDBAK73283723");
bitcoin.crateNewTransaction(300, "23JHEVDJHADA", "KLNDHBGASVDFYAC3762");
bitcoin.crateNewTransaction(2000, "GVASYD35723", "DNSBDV232736732");

bitcoin.createNewBlock(22329, "0YUDSDSDA7873ASHA", "73HJVDJAS893");

console.log(bitcoin);

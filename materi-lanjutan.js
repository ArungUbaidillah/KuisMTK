/**
 * ============================================================================
 * MODUL LANJUTAN (PART 2 DARI 2): materi-lanjutan.js
 * Cakupan Materi Kelas X SMA Indonesia:
 * 3. Fungsi Eksponen (window.MATH_BANK.fungsi_eksponen) — 10 Generator Berparameter
 * 4. Fungsi SPLDV (window.MATH_BANK.spldv) — 10 Generator Berparameter
 * ============================================================================
 */

(function () {
  'use strict';

  window.MATH_BANK = window.MATH_BANK || {};

  const U = window.MathUtils || {
    randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    pickOne(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    pickDistinct(arr, count) {
      const copy = [...arr];
      this.shuffle(copy);
      return copy.slice(0, count);
    },
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },
    gcd(a, b) {
      let x = Math.abs(a);
      let y = Math.abs(b);
      while (y !== 0) {
        const t = y;
        y = x % y;
        x = t;
      }
      return x || 1;
    },
    formatNum(num, maxDecimals = 2) {
      if (Number.isInteger(num)) return String(num);
      const fixed = Number(num.toFixed(maxDecimals));
      return String(fixed).replace('.', ',');
    },
    signedTerm(val, variable = '') {
      if (val === 0) return '';
      const sign = val > 0 ? '+' : '-';
      const absVal = Math.abs(val);
      const coeff = absVal === 1 && variable !== '' ? '' : String(absVal);
      return ` ${sign} ${coeff}${variable}`;
    },
    buildOptions(correctText, distractorCandidates) {
      const cleanCorrect = String(correctText).trim();
      const uniqueDistractors = [];
      const seen = new Set([cleanCorrect]);

      for (const cand of distractorCandidates) {
        if (cand === undefined || cand === null) continue;
        const str = String(cand).trim();
        if (str.length > 0 && !seen.has(str)) {
          seen.add(str);
          uniqueDistractors.push(str);
        }
        if (uniqueDistractors.length === 3) break;
      }

      let fallbackOffset = 1;
      while (uniqueDistractors.length < 3) {
        const fallbackStr = `$\\text{Tidak terdefinisi (${fallbackOffset})}$`;
        if (!seen.has(fallbackStr)) {
          seen.add(fallbackStr);
          uniqueDistractors.push(fallbackStr);
        }
        fallbackOffset++;
      }

      const allOptions = [cleanCorrect, ...uniqueDistractors.slice(0, 3)];
      this.shuffle(allOptions);
      return {
        options: allOptions,
        correctIndex: allOptions.indexOf(cleanCorrect)
      };
    }
  };

  /* ==========================================================================
     HELPER PEMFORMATAN ALJABAR & MATA UANG INDONESIA
     ========================================================================== */

  // Format angka ribuan dengan titik (contoh: 125000 -> "125.000")
  function formatThousands(num) {
    const rounded = Math.round(num);
    return String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Format mata uang Rupiah standar sekolah Indonesia (contoh: "Rp25.000,00")
  function formatRupiah(num) {
    return `Rp${formatThousands(num)},00`;
  }

  // Format suku aljabar ax + by dengan tanda yang bersih
  function formatLinearLHS(a, xVar, b, yVar) {
    let firstPart = '';
    if (a === 1) firstPart = xVar;
    else if (a === -1) firstPart = `-${xVar}`;
    else firstPart = `${a}${xVar}`;

    let secondPart = '';
    if (b === 1) secondPart = ` + ${yVar}`;
    else if (b === -1) secondPart = ` - ${yVar}`;
    else if (b > 0) secondPart = ` + ${b}${yVar}`;
    else if (b < 0) secondPart = ` - ${Math.abs(b)}${yVar}`;

    return `${firstPart}${secondPart}`;
  }

  // Format eksponen linear cx + d
  function formatLinearExp(c, d) {
    const xPart = c === 1 ? 'x' : c === -1 ? '-x' : `${c}x`;
    if (d === 0) return xPart;
    const sign = d > 0 ? '+' : '-';
    return `${xPart} ${sign} ${Math.abs(d)}`;
  }

  /* ==========================================================================
     MODUL 3: GENERATOR BANK SOAL FUNGSI EKSPONEN (10 ARCHETYPE BERPARAMETER)
     ========================================================================== */
  const fungsiEksponenGenerators = [
    // Archetype FE1: Evaluasi Nilai Fungsi f(x) = a * b^(cx + d) + k
    function genFungsiEks1() {
      const a = U.pickOne([2, 3, 4, 5]);
      const b = U.pickOne([2, 3]);
      const c = U.pickOne([1, 2]);
      const x0 = U.pickOne([-1, 1, 2, 3]);
      const expResult = U.pickOne([1, 2, 3, 4]);
      const d = expResult - c * x0;
      const k = U.pickOne([-11, -8, -5, -3, 4, 6, 7, 9, 12]);

      const powerVal = Math.pow(b, expResult);
      const ans = a * powerVal + k;

      const expStr = formatLinearExp(c, d);
      const kStr = U.signedTerm(k);

      const id = `FEK-01-${a}-${b}-${c}-${d}-${k}-${x0}`;
      const question = `Diketahui fungsi eksponen $f(x) = ${a} \\cdot ${b}^{${expStr}}${kStr}$. Nilai dari $f(${x0})$ adalah $\\dots$`;

      const correctStr = `$${ans}$`;
      const distractors = [
        `$${Math.pow(a * b, expResult) + k}$`,
        `$${a * powerVal - k}$`,
        `$${a * Math.pow(b, Math.max(0, expResult - 1)) + k}$`,
        `$${ans + a * b}$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1:</strong> Substitusikan nilai $x = ${x0}$ ke dalam rumus fungsi $f(x) = ${a} \\cdot ${b}^{${expStr}}${kStr}$:
        $$f(${x0}) = ${a} \\cdot ${b}^{${c === 1 ? `(${x0})` : `${c}(${x0})`}${U.signedTerm(d)}}${kStr}$$</p>
        <p><strong>Langkah 2:</strong> Hitung nilai pangkat terlebih dahulu:
        $$${c * x0}${U.signedTerm(d)} = ${expResult} \\implies ${b}^{${expResult}} = ${powerVal}$$</p>
        <p><strong>Langkah 3:</strong> Kalikan dengan koefisien $${a}$ lalu operasikan dengan konstanta $${k}$:
        $$f(${x0}) = ${a} \\cdot ${powerVal}${kStr} = ${a * powerVal}${kStr} = ${ans}$$</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype FE2: Titik Potong Grafik Fungsi Eksponen terhadap Sumbu-Y
    function genFungsiEks2() {
      const a = U.pickOne([-4, -3, -2, 2, 3, 4, 5]);
      const b = U.pickOne([2, 3]);
      const p = U.pickOne([1, 2, 3]);
      const c = U.pickOne([-9, -7, -5, -4, 3, 5, 6, 8, 11]);

      const bp = Math.pow(b, p);
      const yInt = a * bp + c;
      const cStr = U.signedTerm(c);

      const id = `FEK-02-${a}-${b}-${p}-${c}`;
      const question = `Koordinat titik potong grafik fungsi eksponen $f(x) = ${a} \\cdot ${b}^{x + ${p}}${cStr}$ terhadap sumbu-Y adalah $\\dots$`;

      const correctStr = `$(0, ${yInt})$`;
      const distractors = [
        `$(0, ${a + c})$`,
        `$(0, ${c})$`,
        `$(${yInt}, 0)$`,
        `$(0, ${a * bp - c})$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1:</strong> Grafik memotong sumbu-Y ketika nilai absis $x = 0$.</p>
        <p><strong>Langkah 2:</strong> Substitusikan $x = 0$ ke dalam persamaan fungsi:
        $$y = f(0) = ${a} \\cdot ${b}^{0 + ${p}}${cStr} = ${a} \\cdot ${b}^{${p}}${cStr}$$</p>
        <p><strong>Langkah 3:</strong> Hitung nilai ordinat $y$:
        $$y = ${a} \\cdot ${bp}${cStr} = ${a * bp}${cStr} = ${yInt}$$</p>
        <p><strong>Langkah 4:</strong> Jadi, koordinat titik potong grafik terhadap sumbu-Y adalah $(0, ${yInt})$.</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype FE3: Titik Potong Grafik Fungsi Eksponen terhadap Sumbu-X
    function genFungsiEks3() {
      const a = U.pickOne([2, 3, 4, 5]);
      const b = U.pickOne([2, 3, 5]);
      const p = U.pickOne([1, 2]);
      const xInt = U.pickOne([-2, -1, 1, 2, 3, 4]);
      const r = U.pickOne([1, 2, 3]);

      const q = r - p * xInt;
      const k = a * Math.pow(b, r);
      const expStr = formatLinearExp(p, q);

      const id = `FEK-03-${a}-${b}-${p}-${q}-${r}`;
      const question = `Grafik fungsi eksponen $f(x) = ${a} \\cdot ${b}^{${expStr}} - ${k}$ memotong sumbu-X pada titik $\\dots$`;

      const correctStr = `$(${xInt}, 0)$`;
      const distractors = [
        `$(0, ${xInt})$`,
        `$(${-xInt}, 0)$`,
        `$(${xInt + 2}, 0)$`,
        `$(${r}, 0)$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1:</strong> Titik potong terhadap sumbu-X dicapai saat $f(x) = 0$:
        $$${a} \\cdot ${b}^{${expStr}} - ${k} = 0 \\implies ${a} \\cdot ${b}^{${expStr}} = ${k}$$</p>
        <p><strong>Langkah 2:</strong> Bagi kedua ruas dengan $${a}$, kemudian ubah ruas kanan menjadi bilangan berpangkat dengan basis $${b}$:
        $$${b}^{${expStr}} = \\frac{${k}}{${a}} = ${Math.pow(b, r)} = ${b}^{${r}}$$</p>
        <p><strong>Langkah 3:</strong> Samakan eksponen pada kedua ruas:
        $$${expStr} = ${r} \\implies ${p === 1 ? 'x' : `${p}x`} = ${r - q} \\implies x = ${xInt}$$</p>
        <p><strong>Langkah 4:</strong> Jadi, titik potong grafik terhadap sumbu-X adalah $(${xInt}, 0)$.</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype FE4: Persamaan Asimtot Datar dan Daerah Hasil (Range) Fungsi Eksponen
    function genFungsiEks4() {
      const a = U.pickOne([-5, -4, -3, -2, 2, 3, 4, 5]);
      const b = U.pickOne([2, 3, 5]);
      const m = U.pickOne([1, 2]);
      const n = U.pickOne([-3, -2, -1, 1, 2, 3]);
      const c = U.pickOne([-10, -8, -6, -4, -2, 3, 5, 7, 9]);

      const expStr = formatLinearExp(m, n);
      const cStr = U.signedTerm(c);
      const ineqCorrect = a > 0 ? '>' : '<';
      const ineqWrong = a > 0 ? '<' : '>';

      const id = `FEK-04-${a}-${b}-${m}-${n}-${c}`;
      const question = `Persamaan asimtot datar dan daerah hasil ($R_f$) dari fungsi eksponen $f(x) = ${a} \\cdot ${b}^{${expStr}}${cStr}$ berturut-turut adalah $\\dots$`;

      const correctStr = `Asimtot $y = ${c}$ dan $R_f = \\{y \\mid y ${ineqCorrect} ${c},\\; y \\in \\mathbb{R}\\}$`;
      const distractors = [
        `Asimtot $y = ${c}$ dan $R_f = \\{y \\mid y ${ineqWrong} ${c},\\; y \\in \\mathbb{R}\\}$`,
        `Asimtot $y = ${-c}$ dan $R_f = \\{y \\mid y ${ineqCorrect} ${-c},\\; y \\in \\mathbb{R}\\}$`,
        `Asimtot $y = ${a}$ dan $R_f = \\{y \\mid y ${ineqCorrect} ${a},\\; y \\in \\mathbb{R}\\}$`,
        `Asimtot $x = ${c}$ dan $R_f = \\{y \\mid y \\geq ${c},\\; y \\in \\mathbb{R}\\}$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1:</strong> Untuk setiap bilangan riil $x$, nilai bentuk eksponen selalu positif: $${b}^{${expStr}} > 0$.</p>
        <p><strong>Langkah 2:</strong> Karena koefisien $a = ${a}$ bernilai ${a > 0 ? 'positif ($a > 0$)' : 'negatif ($a < 0$)'}, maka:
        $$${a} \\cdot ${b}^{${expStr}} ${ineqCorrect} 0$$</p>
        <p><strong>Langkah 3:</strong> Tambahkan kedua ruas dengan konstanta $c = ${c}$:
        $$${a} \\cdot ${b}^{${expStr}}${cStr} ${ineqCorrect} ${c} \\implies f(x) ${ineqCorrect} ${c}$$</p>
        <p><strong>Langkah 4:</strong> Ketika $${b}^{${expStr}} \\to 0$, nilai $f(x)$ mendekati garis $y = ${c}$ tetapi tidak pernah menyentuhnya. Dengan demikian, asimtot datarnya adalah $y = ${c}$ dan daerah hasilnya adalah $R_f = \\{y \\mid y ${ineqCorrect} ${c},\\; y \\in \\mathbb{R}\\}$.</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype FE5: Menentukan Rumus Fungsi f(x) = a * b^x + c dari Titik Koordinat dan Asimtot
    function genFungsiEks5() {
      const a = U.pickOne([2, 3, 4, 5]);
      const b = U.pickOne([2, 3, 4]);
      const c = U.pickOne([-6, -5, -4, -3, -2, 1, 2, 3, 4]);
      const x1 = U.pickOne([2, 3]);

      const y0 = a + c;
      const y1 = a * Math.pow(b, x1) + c;
      const cStr = U.signedTerm(c);
      const cWrongStr = U.signedTerm(-c);

      const id = `FEK-05-${a}-${b}-${c}-${x1}`;
      const question = `Grafik suatu fungsi eksponen $f(x) = a \\cdot b^x + c$ memiliki asimtot datar $y = ${c}$ serta melalui titik $(0, ${y0})$ dan $(${x1}, ${y1})$. Rumus fungsi $f(x)$ tersebut adalah $\\dots$`;

      const correctStr = `$f(x) = ${a} \\cdot ${b}^x${cStr}$`;
      const distractors = [
        `$f(x) = ${b} \\cdot ${a}^x${cStr}$`,
        `$f(x) = ${a} \\cdot ${b}^x${cWrongStr}$`,
        `$f(x) = ${a} \\cdot ${b + 1}^x${cStr}$`,
        `$f(x) = ${y0} \\cdot ${b}^x${cStr}$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1:</strong> Dari persamaan asimtot datar fungsi $f(x) = a \\cdot b^x + c$, diperoleh langsung nilai $c = ${c}$.</p>
        <p><strong>Langkah 2:</strong> Substitusikan titik $(0, ${y0})$ untuk menentukan nilai $a$:
        $$f(0) = a \\cdot b^0 + (${c}) = ${y0} \\implies a + (${c}) = ${y0} \\implies a = ${y0} - (${c}) = ${a}$$</p>
        <p><strong>Langkah 3:</strong> Substitusikan titik $(${x1}, ${y1})$ untuk menentukan basis $b$ ($b > 0$):
        $$f(${x1}) = ${a} \\cdot b^{${x1}} + (${c}) = ${y1}$$
        $$${a} \\cdot b^{${x1}} = ${y1 - c} \\implies b^{${x1}} = \\frac{${y1 - c}}{${a}} = ${Math.pow(b, x1)} \\implies b = ${b}$$</p>
        <p><strong>Langkah 4:</strong> Maka rumus fungsi eksponennya adalah $f(x) = ${a} \\cdot ${b}^x${cStr}$.</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype FE6: Model Pertumbuhan Eksponensial (Pembelahan Bakteri)
    function genFungsiEks6() {
      const r = U.pickOne([2, 3]);
      const n0 = U.pickOne([40, 50, 75, 100, 120, 150, 200]);
      const periodMin = U.pickOne([15, 20, 25, 30]);
      const nSteps = r === 2 ? U.pickOne([4, 5, 6]) : U.pickOne([3, 4]);

      const totalMin = nSteps * periodMin;
      const finalCount = n0 * Math.pow(r, nSteps);
      const wrongGeo = n0 * Math.pow(r, nSteps - 1);
      const wrongPlus = n0 * Math.pow(r, nSteps + 1);
      const wrongLinear = n0 * r * nSteps;

      const id = `FEK-06-${r}-${n0}-${periodMin}-${nSteps}`;
      const question = `Dalam sebuah penelitian mikrobiologi, terdapat mula-mula $${n0}$ koloni bakteri. Setiap $${periodMin}$ menit, setiap bakteri membelah diri menjadi $${r}$ kali lipat dari jumlah sebelumnya. Banyaknya bakteri setelah $${totalMin}$ menit adalah $\\dots$`;

      const correctStr = `$${formatThousands(finalCount)}\\text{ bakteri}$`;
      const distractors = [
        `$${formatThousands(wrongGeo)}\\text{ bakteri}$`,
        `$${formatThousands(wrongPlus)}\\text{ bakteri}$`,
        `$${formatThousands(wrongLinear)}\\text{ bakteri}$`,
        `$${formatThousands(finalCount + n0)}\\text{ bakteri}$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1:</strong> Gunakan rumus pertumbuhan eksponensial pembelahan bakteri:
        $$N(n) = N_0 \\cdot r^n$$
        dengan $N_0 = ${n0}$, rasio pembelahan $r = ${r}$, dan $n$ menyatakan banyaknya periode pembelahan.</p>
        <p><strong>Langkah 2:</strong> Hitung banyaknya periode pembelahan ($n$) selama $${totalMin}$ menit:
        $$n = \\frac{${totalMin}\\text{ menit}}{${periodMin}\\text{ menit}} = ${nSteps}\\text{ kali pembelahan}$$</p>
        <p><strong>Langkah 3:</strong> Substitusikan ke dalam rumus (perhatikan bahwa pangkatnya adalah $n$, bukan $n - 1$, karena $N_0$ adalah kondisi pada $t = 0$):
        $$N(${nSteps}) = ${n0} \\cdot ${r}^{${nSteps}} = ${n0} \\cdot ${Math.pow(r, nSteps)} = ${formatThousands(finalCount)}\\text{ bakteri}$$</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype FE7: Model Peluruhan Eksponensial (Waktu Paruh Zat Radioaktif)
    function genFungsiEks7() {
      const nSteps = U.pickOne([3, 4, 5]);
      const oddOrEvenFactor = U.pickOne([3, 5, 7, 9, 11, 12, 14, 15]);
      // Pilih M0 = oddOrEvenFactor * 2^(nSteps - 1) agar hasil akhir berupa bilangan bulat atau desimal ,5
      const m0 = oddOrEvenFactor * Math.pow(2, nSteps - 1);
      const halfLife = U.pickOne([2, 3, 4, 6, 8]);
      const totalTime = nSteps * halfLife;

      const remainingMass = m0 / Math.pow(2, nSteps);
      const formattedAns = U.formatNum(remainingMass);

      const id = `FEK-07-${m0}-${halfLife}-${nSteps}`;
      const question = `Suatu isotop radioaktif bermassa mula-mula $${m0}\\text{ gram}$ mengalami peluruhan sehingga massanya menyusut menjadi setengah dari massa sebelumnya setiap $${halfLife}\\text{ jam}$ (waktu paruh). Massa zat radioaktif yang tersisa setelah meluruh selama $${totalTime}\\text{ jam}$ adalah $\\dots$`;

      const correctStr = `$${formattedAns}\\text{ gram}$`;
      const distractors = [
        `$${U.formatNum(remainingMass * 2)}\\text{ gram}$`,
        `$${U.formatNum(remainingMass / 2)}\\text{ gram}$`,
        `$${U.formatNum(m0 / (2 * nSteps))}\\text{ gram}$`,
        `$${U.formatNum(remainingMass + 2)}\\text{ gram}$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1:</strong> Model peluruhan waktu paruh dinyatakan dengan fungsi eksponen:
        $$M(n) = M_0 \\cdot \\left(\\frac{1}{2}\\right)^n$$
        dengan massa awal $M_0 = ${m0}\\text{ gram}$ dan $n = \\frac{t}{T}$.</p>
        <p><strong>Langkah 2:</strong> Hitung banyaknya periode waktu paruh ($n$):
        $$n = \\frac{${totalTime}\\text{ jam}}{${halfLife}\\text{ jam}} = ${nSteps}$$</p>
        <p><strong>Langkah 3:</strong> Hitung sisa massa zat setelah $${nSteps}$ periode:
        $$M(${nSteps}) = ${m0} \\cdot \\left(\\frac{1}{2}\\right)^{${nSteps}} = \\frac{${m0}}{${Math.pow(2, nSteps)}} = ${formattedAns}\\text{ gram}$$</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype FE8: Pertumbuhan Majemuk (Populasi / Nilai Investasi dalam Persentase)
    function genFungsiEks8() {
      const rateConfig = U.pickOne([
        { pct: 10, factorStr: '1,1', multNum: 11, multDen: 10, n: 2, baseUnit: 100 },
        { pct: 20, factorStr: '1,2', multNum: 6, multDen: 5, n: 2, baseUnit: 25 },
        { pct: 25, factorStr: '1,25', multNum: 5, multDen: 4, n: 2, baseUnit: 16 },
        { pct: 50, factorStr: '1,5', multNum: 3, multDen: 2, n: 3, baseUnit: 8 }
      ]);

      const kMult = U.randInt(2, 6) * 1000;
      const p0 = rateConfig.baseUnit * kMult;
      const n = rateConfig.n;

      const finalVal = p0 * Math.pow(rateConfig.multNum / rateConfig.multDen, n);
      const linearVal = p0 * (1 + (rateConfig.pct / 100) * n);
      const oneStepVal = p0 * (rateConfig.multNum / rateConfig.multDen);

      const id = `FEK-08-${rateConfig.pct}-${n}-${p0}`;
      const question = `Jumlah penduduk di suatu kawasan tercatat sebanyak $${formatThousands(p0)}$ jiwa. Jika jumlah penduduk mengalami pertumbuhan eksponensial sebesar $${rateConfig.pct}\\%$ setiap tahun dari jumlah tahun sebelumnya, maka jumlah penduduk kawasan tersebut setelah $${n}$ tahun adalah $\\dots$`;

      const correctStr = `$${formatThousands(finalVal)}\\text{ jiwa}$`;
      const distractors = [
        `$${formatThousands(linearVal)}\\text{ jiwa}$`,
        `$${formatThousands(oneStepVal)}\\text{ jiwa}$`,
        `$${formatThousands(finalVal + kMult * 10)}\\text{ jiwa}$`,
        `$${formatThousands(finalVal - kMult * 5)}\\text{ jiwa}$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const factorPow = U.formatNum(Math.pow(rateConfig.multNum / rateConfig.multDen, n), 4);

      const explanation = `
        <p><strong>Langkah 1:</strong> Gunakan rumus pertumbuhan eksponensial majemuk:
        $$P_n = P_0 \\cdot (1 + i)^n$$
        dengan populasi awal $P_0 = ${formatThousands(p0)}$, laju pertumbuhan $i = ${rateConfig.pct}\\% = ${U.formatNum(rateConfig.pct / 100)}$, dan waktu $n = ${n}$ tahun.</p>
        <p><strong>Langkah 2:</strong> Tentukan faktor pengali tahunan:
        $$1 + i = 1 + ${U.formatNum(rateConfig.pct / 100)} = ${rateConfig.factorStr}$$</p>
        <p><strong>Langkah 3:</strong> Hitung jumlah penduduk setelah $${n}$ tahun:
        $$P_{${n}} = ${formatThousands(p0)} \\cdot (${rateConfig.factorStr})^{${n}} = ${formatThousands(p0)} \\cdot ${factorPow} = ${formatThousands(finalVal)}\\text{ jiwa}$$</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype FE9: Analisis Nilai Fungsi Eksponen f(x) = a * b^x dari Dua Nilai Fungsi
    function genFungsiEks9() {
      const a = U.pickOne([2, 3, 4, 5]);
      const b = U.pickOne([2, 3]);
      const x1 = U.pickOne([1, 2]);
      const x2 = x1 + 2;
      const xTarget = x2 + 1;

      const y1 = a * Math.pow(b, x1);
      const y2 = a * Math.pow(b, x2);
      const yTarget = a * Math.pow(b, xTarget);

      const id = `FEK-09-${a}-${b}-${x1}-${x2}`;
      const question = `Suatu fungsi eksponen didefinisikan dengan rumus $f(x) = a \\cdot b^x$ (dengan $a, b > 0$). Jika diketahui $f(${x1}) = ${y1}$ dan $f(${x2}) = ${y2}$, maka nilai dari $f(${xTarget})$ adalah $\\dots$`;

      const correctStr = `$${yTarget}$`;
      const distractors = [
        `$${y2 + (y2 - y1)}$`,
        `$${a * Math.pow(b, xTarget - 1)}$`,
        `$${yTarget * b}$`,
        `$${yTarget + y1}$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1:</strong> Bandingkan nilai $f(${x2})$ dan $f(${x1})$ untuk menentukan basis $b$:
        $$\\frac{f(${x2})}{f(${x1})} = \\frac{a \\cdot b^{${x2}}}{a \\cdot b^{${x1}}} \\implies \\frac{${y2}}{${y1}} = b^{${x2} - ${x1}}$$
        $$b^2 = ${y2 / y1} \\implies b = ${b} \\quad (\\text{karena } b > 0)$$</p>
        <p><strong>Langkah 2:</strong> Gunakan hubungan $f(${xTarget}) = f(${x2}) \\cdot b^{${xTarget} - ${x2}}$:
        $$f(${xTarget}) = f(${x2}) \\cdot b^1 = ${y2} \\cdot ${b} = ${yTarget}$$</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype FE10: Transformasi Geometri (Translasi / Pergeseran) Grafik Fungsi Eksponen
    function genFungsiEks10() {
      const base = U.pickOne([2, 3, 5, 7]);
      const hAbs = U.randInt(1, 5);
      const kAbs = U.randInt(2, 8);
      const dirX = U.pickOne(['kanan', 'kiri']);
      const dirY = U.pickOne(['atas', 'bawah']);

      // Geser ke kanan sebesar h -> x diganti (x - h); ke kiri sebesar h -> (x + h)
      const expSign = dirX === 'kanan' ? '-' : '+';
      const expWrongSign = dirX === 'kanan' ? '+' : '-';

      // Geser ke atas sebesar k -> + k; ke bawah sebesar k -> - k
      const constSign = dirY === 'atas' ? '+' : '-';
      const constWrongSign = dirY === 'atas' ? '-' : '+';

      const id = `FEK-10-${base}-${hAbs}-${dirX}-${kAbs}-${dirY}`;
      const question = `Grafik fungsi eksponen $f(x) = ${base}^x$ digeser sejauh $${hAbs}$ satuan ke ${dirX} dan $${kAbs}$ satuan ke ${dirY} menghasilkan grafik fungsi $g(x)$. Persamaan fungsi $g(x)$ adalah $\\dots$`;

      const correctStr = `$g(x) = ${base}^{x ${expSign} ${hAbs}} ${constSign} ${kAbs}$`;
      const distractors = [
        `$g(x) = ${base}^{x ${expWrongSign} ${hAbs}} ${constSign} ${kAbs}$`,
        `$g(x) = ${base}^{x ${expSign} ${hAbs}} ${constWrongSign} ${kAbs}$`,
        `$g(x) = ${base}^{x ${expWrongSign} ${hAbs}} ${constWrongSign} ${kAbs}$`,
        `$g(x) = ${base}^{x ${constSign} ${kAbs}} ${expSign} ${hAbs}$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const hVec = dirX === 'kanan' ? hAbs : -hAbs;
      const kVec = dirY === 'atas' ? kAbs : -kAbs;

      const explanation = `
        <p><strong>Langkah 1:</strong> Translasi (pergeseran) grafik $y = f(x)$ sejauh $h$ satuan secara horizontal dan $k$ satuan secara vertikal dengan vektor geser $T = \\begin{pmatrix} ${hVec} \\\\ ${kVec} \\end{pmatrix}$ menghasilkan fungsi:
        $$g(x) = f(x - h) + k$$</p>
        <p><strong>Langkah 2:</strong> Pergeseran $${hAbs}$ satuan ke <strong>${dirX}</strong> berarti $h = ${hVec}$, sehingga variabel $x$ pada pangkat berubah menjadi:
        $$x - (${hVec}) = x ${expSign} ${hAbs}$$</p>
        <p><strong>Langkah 3:</strong> Pergeseran $${kAbs}$ satuan ke <strong>${dirY}</strong> berarti konstanta luar ditambah $k = ${kVec}$, sehingga persamaan akhirnya adalah:
        $$g(x) = ${base}^{x ${expSign} ${hAbs}} ${constSign} ${kAbs}$$</p>
      `;

      return { id, question, options, correctIndex, explanation };
    }
  ];

  /* ==========================================================================
     MODUL 4: GENERATOR BANK SOAL FUNGSI SPLDV (10 ARCHETYPE BERPARAMETER)
     ========================================================================== */
  const spldvGenerators = [
    // Archetype S1: Menentukan Himpunan Penyelesaian {(x, y)} dari SPLDV Standar
    function genSpldv1() {
      const x0 = U.pickOne([-4, -3, -2, 2, 3, 4, 5, 6]);
      const y0 = U.pickOne([-5, -3, -2, 1, 2, 3, 4, 5].filter(v => v !== x0));

      const coeffSets = [
        [2, 3, 1, -2],
        [3, 2, 2, -1],
        [4, -1, 2, 3],
        [3, -2, 1, 4],
        [2, 5, 3, -2],
        [5, 2, 2, -3]
      ];
      const [a1, b1, a2, b2] = U.pickOne(coeffSets);

      const c1 = a1 * x0 + b1 * y0;
      const c2 = a2 * x0 + b2 * y0;

      const eq1Str = `${formatLinearLHS(a1, 'x', b1, 'y')} = ${c1}`;
      const eq2Str = `${formatLinearLHS(a2, 'x', b2, 'y')} = ${c2}`;

      const id = `SPL-01-${a1}-${b1}-${a2}-${b2}-${x0}-${y0}`;
      const question = `Himpunan penyelesaian $(x, y)$ dari sistem persamaan linear dua variabel:
      $$\\begin{cases} ${eq1Str} \\\\ ${eq2Str} \\end{cases}$$
      adalah $\\dots$`;

      const correctStr = `$\\{(${x0}, ${y0})\\}$`;
      const distractors = [
        `$\\{(${y0}, ${x0})\\}$`,
        `$\\{(${-x0}, ${y0})\\}$`,
        `$\\{(${x0}, ${-y0})\\}$`,
        `$\\{(${x0 + 1}, ${y0 - 1})\\}$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      // Eliminasi y dengan mengalikan persamaan (1) dengan |b2| dan persamaan (2) dengan |b1|
      const m1 = Math.abs(b2);
      const m2 = Math.abs(b1);
      const sameSignB = (b1 > 0 && b2 > 0) || (b1 < 0 && b2 < 0);
      const opSign = sameSignB ? '-' : '+';
      const opWord = sameSignB ? 'Kurangkan' : 'Jumlahkan';

      const newA = sameSignB ? a1 * m1 - a2 * m2 : a1 * m1 + a2 * m2;
      const newC = sameSignB ? c1 * m1 - c2 * m2 : c1 * m1 + c2 * m2;

      const explanation = `
        <p><strong>Langkah 1 (Eliminasi variabel $y$):</strong> Kalikan persamaan pertama dengan $${m1}$ dan persamaan kedua dengan $${m2}$:
        $$\\begin{aligned}
        ${formatLinearLHS(a1 * m1, 'x', b1 * m1, 'y')} &= ${c1 * m1} \\\\
        ${formatLinearLHS(a2 * m2, 'x', b2 * m2, 'y')} &= ${c2 * m2}
        \\end{aligned}$$</p>
        <p><strong>Langkah 2:</strong> ${opWord} kedua persamaan tersebut (${opSign}):
        $$${newA}x = ${newC} \\implies x = \\frac{${newC}}{${newA}} = ${x0}$$</p>
        <p><strong>Langkah 3 (Substitusi nilai $x = ${x0}$):</strong> Substitusikan ke persamaan pertama:
        $$${a1}(${x0})${U.signedTerm(b1, 'y')} = ${c1} \\implies ${b1}y = ${c1 - a1 * x0} \\implies y = ${y0}$$</p>
        <p><strong>Langkah 4:</strong> Jadi, himpunan penyelesaiannya adalah $\\{(${x0}, ${y0})\\}$.</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype S2: Evaluasi Nilai Fungsi Objektif (px + qy) dari Penyelesaian SPLDV
    function genSpldv2() {
      const x0 = U.randInt(2, 7);
      const y0 = U.randInt(-4, 5) || 3;

      const a1 = U.pickOne([2, 3, 4]);
      const b1 = U.pickOne([1, 2, 3]);
      const a2 = U.pickOne([1, 3, 5]);
      const b2 = U.pickOne([-1, -2, -3]);

      const c1 = a1 * x0 + b1 * y0;
      const c2 = a2 * x0 + b2 * y0;

      const p = U.pickOne([2, 3, 4, 5]);
      const q = U.pickOne([-4, -3, -2, 2, 3, 4]);
      const targetVal = p * x0 + q * y0;

      const eq1Str = `${formatLinearLHS(a1, 'x', b1, 'y')} = ${c1}`;
      const eq2Str = `${formatLinearLHS(a2, 'x', b2, 'y')} = ${c2}`;
      const objStr = formatLinearLHS(p, 'x_0', q, 'y_0');

      const id = `SPL-02-${a1}-${b1}-${a2}-${b2}-${x0}-${y0}-${p}-${q}`;
      const question = `Jika $(x_0, y_0)$ merupakan penyelesaian dari sistem persamaan linear:
      $$\\begin{cases} ${eq1Str} \\\\ ${eq2Str} \\end{cases}$$
      maka nilai dari $${objStr}$ adalah $\\dots$`;

      const correctStr = `$${targetVal}$`;
      const distractors = [
        `$${p * y0 + q * x0}$`,
        `$${p * x0 - q * y0}$`,
        `$${targetVal + p}$`,
        `$${targetVal - q}$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1:</strong> Eliminasi atau substitusikan sistem persamaan untuk memperoleh nilai $x_0$ dan $y_0$. Kalikan persamaan pertama dengan $${Math.abs(b2)}$ dan persamaan kedua dengan $${b1}$:
        $$\\begin{aligned}
        ${formatLinearLHS(a1 * Math.abs(b2), 'x', b1 * Math.abs(b2), 'y')} &= ${c1 * Math.abs(b2)} \\\\
        ${formatLinearLHS(a2 * b1, 'x', b2 * b1, 'y')} &= ${c2 * b1}
        \\end{aligned}$$</p>
        <p><strong>Langkah 2:</strong> Jumlahkan kedua persamaan:
        $$${a1 * Math.abs(b2) + a2 * b1}x = ${c1 * Math.abs(b2) + c2 * b1} \\implies x_0 = ${x0}$$</p>
        <p><strong>Langkah 3:</strong> Substitusikan $x_0 = ${x0}$ ke persamaan pertama:
        $$${a1}(${x0}) + ${b1 === 1 ? '' : b1}y = ${c1} \\implies y_0 = ${y0}$$</p>
        <p><strong>Langkah 4:</strong> Hitung nilai ekspresi $${objStr}$:
        $$${p}(${x0})${U.signedTerm(q)}(${y0}) = ${p * x0}${U.signedTerm(q * y0)} = ${targetVal}$$</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype S3: Koordinat Titik Potong Dua Garis Fungsi Linear pada Bidang Kartesius
    function genSpldv3() {
      const x0 = U.pickOne([-3, -2, 2, 3, 4, 5]);
      const m1 = U.pickOne([2, 3, -2]);
      const n1 = U.pickOne([-5, -3, -1, 1, 2, 4]);
      const y0 = m1 * x0 + n1;

      const a = U.pickOne([2, 3, 4]);
      const b = U.pickOne([1, 2, 3]);
      const c = a * x0 + b * y0;

      const line1Str = `y = ${formatLinearExp(m1, n1)}`;
      const line2Str = `${formatLinearLHS(a, 'x', b, 'y')} = ${c}`;

      const id = `SPL-03-${x0}-${m1}-${n1}-${a}-${b}`;
      const question = `Pada bidang koordinat Kartesius, garis $g_1$ dengan persamaan $${line1Str}$ berpotongan dengan garis $g_2$ yang memiliki persamaan $${line2Str}$ di titik $P$. Koordinat titik potong $P$ adalah $\\dots$`;

      const correctStr = `$(${x0}, ${y0})$`;
      const distractors = [
        `$(${y0}, ${x0})$`,
        `$(${-x0}, ${y0})$`,
        `$(${x0}, ${-y0})$`,
        `$(${x0 + 1}, ${y0 + m1})$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const totalCoeffX = a + b * m1;
      const constTerm = b * n1;

      const explanation = `
        <p><strong>Langkah 1:</strong> Titik potong dua garis merupakan penyelesaian dari SPLDV kedua persamaan garis tersebut. Gunakan metode substitusi dengan memasukkan $${line1Str}$ ke persamaan $${line2Str}$:
        $$${a}x + ${b === 1 ? '' : b}(${formatLinearExp(m1, n1)}) = ${c}$$</p>
        <p><strong>Langkah 2:</strong> Jabarkan dan kumpulkan suku bervariabel $x$:
        $$${a}x${U.signedTerm(b * m1, 'x')}${U.signedTerm(constTerm)} = ${c}$$
        $$${totalCoeffX}x = ${c - constTerm} \\implies x = ${x0}$$</p>
        <p><strong>Langkah 3:</strong> Substitusikan $x = ${x0}$ ke persamaan garis $g_1$:
        $$y = ${m1}(${x0})${U.signedTerm(n1)} = ${m1 * x0}${U.signedTerm(n1)} = ${y0}$$</p>
        <p><strong>Langkah 4:</strong> Jadi, koordinat titik potong $P$ adalah $(${x0}, ${y0})$.</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype S4: Soal Cerita Kontekstual — Transaksi Pembelian Barang di Koperasi Sekolah
    function genSpldv4() {
      const priceBook = U.pickOne([5000, 6000, 7000, 8000, 9000]);
      const pricePen = U.pickOne([2000, 3000, 4000]);

      const a1 = U.pickOne([3, 4, 5]);
      const b1 = U.pickOne([2, 3]);
      const a2 = U.pickOne([2, 3]);
      const b2 = U.pickOne([4, 5]);

      const total1 = a1 * priceBook + b1 * pricePen;
      const total2 = a2 * priceBook + b2 * pricePen;

      const askBook = U.pickOne([1, 2, 4]);
      const askPen = U.pickOne([2, 3, 5]);
      const ansTotal = askBook * priceBook + askPen * pricePen;

      const id = `SPL-04-${priceBook}-${pricePen}-${a1}-${b1}-${a2}-${b2}`;
      const question = `Di koperasi sekolah, harga $${a1}$ buku tulis dan $${b1}$ pena adalah ${formatRupiah(total1)}, sedangkan harga $${a2}$ buku tulis dan $${b2}$ pena yang sejenis adalah ${formatRupiah(total2)}. Jumlah uang yang harus dibayarkan untuk membeli $${askBook}$ buku tulis dan $${askPen}$ pena adalah $\\dots$`;

      const correctStr = `${formatRupiah(ansTotal)}`;
      const distractors = [
        `${formatRupiah(askBook * pricePen + askPen * priceBook)}`,
        `${formatRupiah(ansTotal + pricePen)}`,
        `${formatRupiah(ansTotal - pricePen)}`,
        `${formatRupiah(ansTotal + priceBook)}`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1 (Pemodelan Matematika):</strong> Misalkan $x$ adalah harga $1$ buku tulis dan $y$ adalah harga $1$ pena. Diperoleh SPLDV:
        $$\\begin{cases} ${a1}x + ${b1}y = ${total1} \\\\ ${a2}x + ${b2}y = ${total2} \\end{cases}$$</p>
        <p><strong>Langkah 2 (Eliminasi $x$):</strong> Kalikan persamaan pertama dengan $${a2}$ dan persamaan kedua dengan $${a1}$:
        $$\\begin{aligned}
        ${a1 * a2}x + ${b1 * a2}y &= ${total1 * a2} \\\\
        ${a2 * a1}x + ${b2 * a1}y &= ${total2 * a1}
        \\end{aligned}$$</p>
        <p>Kurangkan kedua persamaan:
        $$${b1 * a2 - b2 * a1}y = ${total1 * a2 - total2 * a1} \\implies y = ${pricePen}$$</p>
        <p><strong>Langkah 3 (Substitusi $y = ${pricePen}$):</strong>
        $$${a1}x + ${b1}(${pricePen}) = ${total1} \\implies ${a1}x = ${total1 - b1 * pricePen} \\implies x = ${priceBook}$$</p>
        <p><strong>Langkah 4:</strong> Hitung harga $${askBook}$ buku tulis dan $${askPen}$ pena:
        $$${askBook}x + ${askPen}y = ${askBook}(${priceBook}) + ${askPen}(${pricePen}) = ${ansTotal} \\text{ (${formatRupiah(ansTotal)})}$$</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype S5: Soal Cerita Kontekstual — Perbandingan dan Jumlah Umur
    function genSpldv5() {
      const kPast = U.pickOne([3, 4, 5]);
      const ratioPast = U.pickOne([3, 4, 5]);
      const yPast = U.randInt(6, 11);
      const xPast = ratioPast * yPast;

      // Umur sekarang
      const xNow = xPast + kPast; // Umur Ayah sekarang
      const yNow = yPast + kPast; // Umur Anak sekarang

      const pFuture = U.pickOne([4, 5, 6]);
      const sumFuture = (xNow + pFuture) + (yNow + pFuture);
      const sumNow = xNow + yNow;
      const constEq1 = kPast - ratioPast * kPast; // x - ratioPast * y = constEq1

      const id = `SPL-05-${kPast}-${ratioPast}-${yPast}-${pFuture}`;
      const question = `Lima data keluarga mencatat bahwa $${kPast}$ tahun yang lalu, umur seorang ayah sama dengan $${ratioPast}$ kali umur anaknya. Jika $${pFuture}$ tahun yang akan datang jumlah umur mereka adalah $${sumFuture}$ tahun, maka umur ayah dan umur anak saat ini berturut-turut adalah $\\dots$`;

      const correctStr = `$${xNow}\\text{ tahun dan } ${yNow}\\text{ tahun}$`;
      const distractors = [
        `$${xPast}\\text{ tahun dan } ${yPast}\\text{ tahun}$`,
        `$${xNow + 2}\\text{ tahun dan } ${yNow - 2}\\text{ tahun}$`,
        `$${xNow - kPast}\\text{ tahun dan } ${yNow + kPast}\\text{ tahun}$`,
        `$${xNow + pFuture}\\text{ tahun dan } ${yNow + pFuture}\\text{ tahun}$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1:</strong> Misalkan umur ayah sekarang adalah $x$ tahun dan umur anak sekarang adalah $y$ tahun.</p>
        <p><strong>Langkah 2:</strong> Kondisi $${kPast}$ tahun yang lalu:
        $$x - ${kPast} = ${ratioPast}(y - ${kPast}) \\implies x - ${ratioPast}y = ${constEq1} \\quad \\dots (1)$$</p>
        <p><strong>Langkah 3:</strong> Kondisi $${pFuture}$ tahun yang akan datang:
        $$(x + ${pFuture}) + (y + ${pFuture}) = ${sumFuture} \\implies x + y = ${sumNow} \\quad \\dots (2)$$</p>
        <p><strong>Langkah 4:</strong> Kurangkan persamaan $(2)$ dengan persamaan $(1)$ untuk mengeliminasi $x$:
        $$(x + y) - (x - ${ratioPast}y) = ${sumNow} - (${constEq1})$$
        $$${ratioPast + 1}y = ${sumNow - constEq1} \\implies y = ${yNow}\\text{ tahun}$$</p>
        <p>Substitusikan $y = ${yNow}$ ke persamaan $(2)$:
        $$x = ${sumNow} - ${yNow} = ${xNow}\\text{ tahun}$$</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype S6: SPLDV Bentuk Pecahan (Variabel pada Penyebut)
    function genSpldv6() {
      const [x0, y0] = U.pickDistinct([2, 3, 4, 5, 6], 2);

      // Pilih m1, n1, m2, n2 sehingga p1 = m1*x0, q1 = n1*y0 menghasilkan konstanta ruas kanan bulat
      const m1 = U.pickOne([2, 3]);
      const n1 = U.pickOne([1, 2, 3]);
      const m2 = U.pickOne([1, 2, 4]);
      const n2 = U.pickOne([-1, -2]);

      const p1 = m1 * x0;
      const q1 = n1 * y0;
      const r1 = m1 + n1;

      const p2 = m2 * x0;
      const q2Abs = Math.abs(n2) * y0;
      const r2 = m2 + n2;

      const ansSum = x0 + y0;

      const id = `SPL-06-${x0}-${y0}-${m1}-${n1}-${m2}-${n2}`;
      const question = `Diketahui sistem persamaan dengan variabel pada penyebut:
      $$\\begin{cases} \\dfrac{${p1}}{x} + \\dfrac{${q1}}{y} = ${r1} \\\\[6pt] \\dfrac{${p2}}{x} - \\dfrac{${q2Abs}}{y} = ${r2} \\end{cases}$$
      Nilai dari $x + y$ yang memenuhi sistem persamaan tersebut adalah $\\dots$`;

      const correctStr = `$${ansSum}$`;
      const distractors = [
        `$${Math.abs(x0 - y0)}$`,
        `$${x0 * y0}$`,
        `$${ansSum + 2}$`,
        `$${U.formatNum(1 / x0 + 1 / y0)}$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1:</strong> Misalkan $u = \\frac{1}{x}$ dan $v = \\frac{1}{y}$, sehingga sistem berubah menjadi SPLDV linear dalam $u$ dan $v$:
        $$\\begin{cases} ${p1}u + ${q1}v = ${r1} \\\\ ${p2}u - ${q2Abs}v = ${r2} \\end{cases}$$</p>
        <p><strong>Langkah 2:</strong> Eliminasi $v$ dengan mengalikan persamaan pertama dengan $${Math.abs(n2)}$ dan persamaan kedua dengan $${n1}$:
        $$\\begin{aligned}
        ${p1 * Math.abs(n2)}u + ${q1 * Math.abs(n2)}v &= ${r1 * Math.abs(n2)} \\\\
        ${p2 * n1}u - ${q2Abs * n1}v &= ${r2 * n1}
        \\end{aligned}$$</p>
        <p>Jumlahkan kedua persamaan:
        $$${p1 * Math.abs(n2) + p2 * n1}u = ${r1 * Math.abs(n2) + r2 * n1} \\implies u = \\frac{1}{${x0}} \\implies x = ${x0}$$</p>
        <p><strong>Langkah 3:</strong> Substitusikan $u = \\frac{1}{${x0}}$ ke persamaan pertama:
        $$${p1}\\left(\\frac{1}{${x0}}\\right) + ${q1}v = ${r1} \\implies ${m1} + ${q1}v = ${r1} \\implies ${q1}v = ${n1} \\implies v = \\frac{1}{${y0}} \\implies y = ${y0}$$</p>
        <p><strong>Langkah 4:</strong> Maka nilai $x + y = ${x0} + ${y0} = ${ansSum}$.</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype S7: Aplikasi Geometri SPLDV — Keliling dan Luas Persegi Panjang
    function genSpldv7() {
      const lebar = U.randInt(8, 18);
      const diff = U.randInt(4, 12);
      const panjang = lebar + diff;

      const sumPL = panjang + lebar;
      const keliling = 2 * sumPL;
      const luas = panjang * lebar;

      const id = `SPL-07-${panjang}-${lebar}`;
      const question = `Sebuah lahan berbentuk persegi panjang memiliki keliling $${keliling}\\text{ m}$. Jika selisih antara ukuran panjang dan lebarnya adalah $${diff}\\text{ m}$, maka luas lahan persegi panjang tersebut adalah $\\dots$`;

      const correctStr = `$${formatThousands(luas)}\\text{ m}^2$`;
      const distractors = [
        `$${formatThousands((panjang + 2) * (lebar - 2))}\\text{ m}^2$`,
        `$${formatThousands(sumPL * diff)}\\text{ m}^2$`,
        `$${formatThousands(luas + 2 * lebar)}\\text{ m}^2$`,
        `$${formatThousands(2 * luas)}\\text{ m}^2$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1:</strong> Misalkan panjang persegi panjang adalah $p$ dan lebarnya adalah $l$ (dengan $p > l$). Dari rumus keliling $K = 2(p + l) = ${keliling}$, diperoleh:
        $$p + l = \\frac{${keliling}}{2} = ${sumPL} \\quad \\dots (1)$$</p>
        <p><strong>Langkah 2:</strong> Dari informasi selisih panjang dan lebar diperoleh persamaan kedua:
        $$p - l = ${diff} \\quad \\dots (2)$$</p>
        <p><strong>Langkah 3:</strong> Eliminasi $l$ dengan menjumlahkan persamaan $(1)$ dan $(2)$:
        $$2p = ${sumPL + diff} \\implies p = ${panjang}\\text{ m}$$
        Substitusikan $p = ${panjang}$ ke persamaan $(1)$:
        $$l = ${sumPL} - ${panjang} = ${lebar}\\text{ m}$$</p>
        <p><strong>Langkah 4:</strong> Hitung luas lahan persegi panjang ($L = p \\times l$):
        $$L = ${panjang} \\times ${lebar} = ${formatThousands(luas)}\\text{ m}^2$$</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype S8: Menentukan Rumus & Nilai Fungsi Linear f(x) = ax + b melalui SPLDV
    function genSpldv8() {
      const a = U.pickOne([-4, -3, -2, 2, 3, 4, 5]);
      const b = U.pickOne([-7, -5, -3, 2, 4, 6, 8]);
      const [x1, x2] = U.pickDistinct([-2, -1, 1, 2, 3, 4], 2);
      const xTarget = U.pickOne([5, 6, -3, -4].filter(v => v !== x1 && v !== x2));

      const y1 = a * x1 + b;
      const y2 = a * x2 + b;
      const yTarget = a * xTarget + b;

      const id = `SPL-08-${a}-${b}-${x1}-${x2}-${xTarget}`;
      const question = `Suatu fungsi linear dirumuskan dengan $f(x) = ax + b$. Jika diketahui $f(${x1}) = ${y1}$ dan $f(${x2}) = ${y2}$, maka nilai dari $f(${xTarget})$ adalah $\\dots$`;

      const correctStr = `$${yTarget}$`;
      const distractors = [
        `$${a * xTarget - b}$`,
        `$${-a * xTarget + b}$`,
        `$${yTarget + a}$`,
        `$${b * xTarget + a}$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1:</strong> Substitusikan nilai $x = ${x1}$ dan $x = ${x2}$ ke dalam $f(x) = ax + b$ untuk membentuk SPLDV dalam variabel $a$ dan $b$:
        $$\\begin{cases} ${formatLinearLHS(x1, 'a', 1, 'b')} = ${y1} \\\\ ${formatLinearLHS(x2, 'a', 1, 'b')} = ${y2} \\end{cases}$$</p>
        <p><strong>Langkah 2:</strong> Kurangkan persamaan pertama dengan persamaan kedua untuk mengeliminasi $b$:
        $$(${x1} - (${x2}))a = ${y1} - (${y2}) \\implies ${x1 - x2}a = ${y1 - y2} \\implies a = ${a}$$</p>
        <p><strong>Langkah 3:</strong> Substitusikan $a = ${a}$ ke persamaan pertama:
        $$${x1}(${a}) + b = ${y1} \\implies b = ${y1} - (${x1 * a}) = ${b}$$</p>
        <p><strong>Langkah 4:</strong> Diperoleh rumus fungsi $f(x) = ${formatLinearExp(a, b)}$. Maka nilai $f(${xTarget})$ adalah:
        $$f(${xTarget}) = ${a}(${xTarget})${U.signedTerm(b)} = ${a * xTarget}${U.signedTerm(b)} = ${yTarget}$$</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype S9: Soal Cerita Kontekstual — Kendaraan dan Pendapatan Parkir
    function genSpldv9() {
      const cars = U.randInt(12, 30);
      const bikes = U.randInt(20, 45);
      const totalVehicles = cars + bikes;
      const totalWheels = 4 * cars + 2 * bikes;

      const feeCar = U.pickOne([5000, 6000, 8000, 10000]);
      const feeBike = U.pickOne([2000, 3000]);
      const totalIncome = cars * feeCar + bikes * feeBike;

      const id = `SPL-09-${cars}-${bikes}-${feeCar}-${feeBike}`;
      const question = `Di sebuah area parkir terdapat $${totalVehicles}$ kendaraan yang terdiri atas mobil (beroda $4$) dan sepeda motor (beroda $2$). Setelah dihitung, jumlah seluruh roda kendaraan yang terparkir adalah $${totalWheels}$ buah. Jika tarif parkir sebuah mobil adalah ${formatRupiah(feeCar)} dan sebuah sepeda motor adalah ${formatRupiah(feeBike)}, maka total pendapatan parkir pada saat itu adalah $\\dots$`;

      const correctStr = `${formatRupiah(totalIncome)}`;
      const distractors = [
        `${formatRupiah(bikes * feeCar + cars * feeBike)}`,
        `${formatRupiah(totalIncome + 2 * feeCar)}`,
        `${formatRupiah(totalIncome - 2 * feeCar)}`,
        `${formatRupiah(totalVehicles * ((feeCar + feeBike) / 2))}`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1:</strong> Misalkan banyaknya mobil adalah $x$ dan banyaknya sepeda motor adalah $y$. Berdasarkan jumlah kendaraan dan jumlah roda, diperoleh SPLDV:
        $$\\begin{cases} x + y = ${totalVehicles} \\\\ 4x + 2y = ${totalWheels} \\end{cases}$$</p>
        <p><strong>Langkah 2:</strong> Sederhanakan persamaan kedua dengan membagi kedua ruas dengan $2$:
        $$2x + y = ${totalWheels / 2}$$</p>
        <p><strong>Langkah 3:</strong> Eliminasi $y$ dengan mengurangkan persamaan $(2x + y = ${totalWheels / 2})$ dengan $(x + y = ${totalVehicles})$:
        $$x = ${totalWheels / 2} - ${totalVehicles} = ${cars}\\text{ mobil}$$
        Substitusikan $x = ${cars}$ ke persamaan pertama:
        $$y = ${totalVehicles} - ${cars} = ${bikes}\\text{ sepeda motor}$$</p>
        <p><strong>Langkah 4:</strong> Hitung total pendapatan parkir:
        $$\\text{Pendapatan} = ${cars} \\times ${formatThousands(feeCar)} + ${bikes} \\times ${formatThousands(feeBike)} = ${formatRupiah(totalIncome)}$$</p>
      `;

      return { id, question, options, correctIndex, explanation };
    },

    // Archetype S10: Analisis Kedudukan Dua Garis SPLDV (Syarat Tidak Memiliki Penyelesaian)
    function genSpldv10() {
      const a1 = U.pickOne([2, 3, 4, 5]);
      const b1 = U.pickOne([3, 4, 6]);
      const mult = U.pickOne([2, 3]);

      const a2 = a1 * mult;
      const b2Target = b1 * mult;
      const offsetP = U.pickOne([-5, -3, -2, 2, 4, 5]);
      // b2 ditulis sebagai (k + offsetP), sehingga k + offsetP = b2Target -> k = b2Target - offsetP
      const kAns = b2Target - offsetP;

      const c1 = U.randInt(5, 11);
      const c2 = c1 * mult + U.pickOne([3, 5, 7]); // Dijamin c2 != c1 * mult agar sejajar (tidak berimpit)

      const offsetStr = offsetP > 0 ? `k + ${offsetP}` : `k - ${Math.abs(offsetP)}`;

      const id = `SPL-10-${a1}-${b1}-${mult}-${offsetP}`;
      const question = `Diberikan sistem persamaan linear dua variabel:
      $$\\begin{cases} ${a1}x + ${b1}y = ${c1} \\\\ ${a2}x + (${offsetStr})y = ${c2} \\end{cases}$$
      Agar sistem persamaan linear tersebut <strong>tidak memiliki penyelesaian</strong> (kedua garis sejajar), maka nilai parameter $k$ yang memenuhi adalah $\\dots$`;

      const correctStr = `$${kAns}$`;
      const distractors = [
        `$${b2Target + offsetP}$`,
        `$${b1 - offsetP}$`,
        `$${-kAns}$`,
        `$${kAns + a1}$`
      ];

      const { options, correctIndex } = U.buildOptions(correctStr, distractors);

      const explanation = `
        <p><strong>Langkah 1:</strong> Sistem persamaan linear dua variabel $a_1x + b_1y = c_1$ dan $a_2x + b_2y = c_2$ <strong>tidak memiliki penyelesaian</strong> (kedua garis sejajar dan tidak berimpit) apabila memenuhi syarat perbandingan koefisien:
        $$\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2}$$</p>
        <p><strong>Langkah 2:</strong> Substitusikan koefisien dari soal ke dalam persamaan perbandingan:
        $$\\frac{${a1}}{${a2}} = \\frac{${b1}}{${offsetStr}}$$</p>
        <p><strong>Langkah 3:</strong> Sederhanakan pecahan di ruas kiri dan selesaikan untuk $k$:
        $$\\frac{1}{${mult}} = \\frac{${b1}}{${offsetStr}} \\implies ${offsetStr} = ${b1} \\cdot ${mult} = ${b2Target}$$
        $$k = ${b2Target} - (${offsetP}) = ${kAns}$$</p>
        <p><strong>Langkah 4:</strong> Karena $\\frac{c_1}{c_2} = \\frac{${c1}}{${c2}} \\neq \\frac{1}{${mult}}$, maka untuk $k = ${kAns}$ kedua garis sejajar dan SPLDV tidak memiliki penyelesaian.</p>
      `;

      return { id, question, options, correctIndex, explanation };
    }
  ];

  // Daftarkan ke objek global window.MATH_BANK agar langsung terbaca oleh Quiz Engine di index.html
  window.MATH_BANK.fungsi_eksponen = fungsiEksponenGenerators;
  window.MATH_BANK.spldv = spldvGenerators;
})();
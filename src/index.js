import {readFileSync, appendFileSync} from 'fs'
import http from 'http'
import {resolve, join} from 'path'
import {parse} from 'url'
import {stringify} from 'querystring'

const url = process.env.NOISE_TARGET_URL
const origin = process.env.NOISE_ORIGIN
const referer = process.env.NOISE_REFERER
const {host, path, protocol} = parse(url)
const maxAmount = process.env.NOISE_MAX_AMOUNT || 30
const maxTimeframe = process.env.NOISE_MAX_TIMEFRAME || 600

const NAMES = resolve(__dirname, '../data/names.ascii.txt')
const SURNAMES = resolve(__dirname, '../data/surnames.ascii.txt')
const DOMAINS = resolve(__dirname, '../data/domains.txt')
const USER_AGENTS = resolve(__dirname, '../data/useragents.txt')
const PASSWORDS = resolve(__dirname, '../data/passwords.ascii.txt')
const CREDENTIALS_LOG = join(process.cwd(), 'credentials.log')
const RESPONSES_LOG = join(process.cwd(), 'responses.log')

const identity = a => a
const fileLines = {}
const pickRandomLine = (file) => {
  if (!fileLines[file]) {
    fileLines[file] = readFileSync(file, 'utf8').split('\n')
    fileLines[file].pop()
  }
  return fileLines[file][Math.floor(Math.random()*fileLines[file].length)]
}

const generateCredentials = () => {
  const name = pickRandomLine(NAMES).toLowerCase().replace(/\s/, '.')
  const surname = Math.random() < 0.8 ? pickRandomLine(SURNAMES).toLowerCase().replace(/\s/, '.') : null
  const user = surname ? (Math.random() < 0.6 ? name + '.' + surname : name[0] + surname) : name
  const domain = pickRandomLine(DOMAINS)
  const password = pickRandomLine(PASSWORDS)
  const email = user + '%40' + domain
  return {email, password}
}

const send = () => {
  const {email, password} = generateCredentials()
  const credentials = email.replace('%40', '@') + ',' + password
  const ua = pickRandomLine(USER_AGENTS)
  const data = 'Email=' + email + '&Senha=' + password
  const headers = {
    Host: host,
    Connection: 'keep-alive',
    'Content-Length': Buffer.byteLength(data),
    'Cache-Control': 'max-age=0',
    'User-Agent': ua,
    Origin: origin,
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    Referer: referer,
    'Accept-Language': 'en-US,en;q=0.8,pt;q=0.6'
  }
  const options = {
    protocol,
    host,
    path,
    port: 80,
    method: 'POST',
    headers
  };
  const req = http.request(options)
  req.on('response', (res) => {
    const {date, server} = res.headers
    console.log('req:', credentials)
    console.log('res:', res.statusCode, stringify({date, server}, ', ', null, { encodeURIComponent: identity }))
    appendFileSync(RESPONSES_LOG, res.statusCode + ',' + stringify(res.headers) + '\n')
    appendFileSync(CREDENTIALS_LOG, credentials + '\n')
    res.resume()
  })
  req.on('error', (err) => {
    console.log('Failed to send credentials (' + credentials + '), skipping.')
  })
  req.write(data)
  req.end()
}

const sendSome = (amount, timeframe) => {
  amount = Math.ceil(amount)
  timeframe = Math.ceil(timeframe)
  console.log('\nScheduling', amount, 'requests during the next', timeframe, 'seconds.\n')
  for (let i = 0; i < amount; i++) {
    setTimeout(send, Math.random() * timeframe * 1000)
  }
  // At the end of this timeframe, schedule the next one.
  setTimeout(() => {
    sendSome(Math.random() * maxAmount, Math.random() * maxTimeframe)
  }, timeframe * 1000)
}

sendSome(Math.random() * maxAmount, Math.random() * maxTimeframe)

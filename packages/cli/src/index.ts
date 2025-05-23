#!/usr/bin/env node
import { Command } from 'commander';
import { analyzeDriveData } from '@modive/core';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const program = new Command();

program
  .name('modive-cli')
  .description('Drive data analysis tool')
  .version('1.0.0');

program
  .command('analyze <file>')
  .description('Analyze drive data from JSON file')
  .option('-o, --output <file>', 'Output file for analysis results')
  .action((file, options) => {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      console.log(chalk.blue('🚗 분석 중...'));
      
      const result = analyzeDriveData(data);
      
      console.log(chalk.green('✅ 분석 완료'));
      console.log(chalk.yellow('📊 요약:'));
      console.log(`  안전 점수: ${result.safetyScore}/100`);
      console.log(`  에코 점수: ${result.ecoScore}/100`);
      console.log(`  총 점수: ${result.totalScore}/100`);
      
      if (options.output) {
        fs.writeFileSync(options.output, JSON.stringify(result, null, 2));
        console.log(chalk.green(`📄 결과가 ${options.output}에 저장되었습니다`));
      }
    } catch (err) {
      console.error(chalk.red('❌ 오류:'), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program.parse();
/**
 * Tests básicos para validar Value Objects.
 * Ejecutar con: npm test o vitest run
 */

import { describe, it, expect } from 'vitest';
import { FinalResult } from '../domain/value-objects/final-result.vo.js';
import { DocumentNumber } from '../domain/value-objects/document-number.vo.js';
import { PhoneNumber } from '../domain/value-objects/phone-number.vo.js';
import { Address } from '../domain/value-objects/address.vo.js';
import { ReportCode } from '../domain/value-objects/report-code.vo.js';

describe('FinalResult Value Object', () => {
  it('should create valid CONFORME result', () => {
    const result = FinalResult.conforme();
    expect(result.isConforme()).toBe(true);
    expect(result.canExportReport()).toBe(true);
    expect(result.requiresObservations()).toBe(false);
  });

  it('should create valid OBSERVADO result', () => {
    const result = FinalResult.observado();
    expect(result.isObservado()).toBe(true);
    expect(result.requiresObservations()).toBe(true);
  });

  it('should throw on invalid result', () => {
    expect(() => new FinalResult('INVALID')).toThrow();
  });

  it('should be immutable', () => {
    const result = FinalResult.conforme();
    expect(() => {
      result.value = 'RECHAZADO';
    }).toThrow();
  });

  it('should compare correctly', () => {
    const result1 = FinalResult.conforme();
    const result2 = FinalResult.conforme();
    const result3 = FinalResult.observado();
    
    expect(result1.equals(result2)).toBe(true);
    expect(result1.equals(result3)).toBe(false);
  });
});

describe('DocumentNumber Value Object', () => {
  it('should create valid DNI', () => {
    const dni = DocumentNumber.dni('12345678');
    expect(dni.isDNI()).toBe(true);
    expect(dni.number).toBe('12345678');
  });

  it('should throw on invalid DNI format', () => {
    expect(() => DocumentNumber.dni('123')).toThrow();
    expect(() => DocumentNumber.dni('1234567a')).toThrow();
  });

  it('should create valid Carnet de Extranjería', () => {
    const carnet = DocumentNumber.carnetExtranjeria('ABC123456');
    expect(carnet.isCarnetExtranjeria()).toBe(true);
  });

  it('should be immutable', () => {
    const dni = DocumentNumber.dni('12345678');
    expect(() => {
      dni.number = '87654321';
    }).toThrow();
  });
});

describe('PhoneNumber Value Object', () => {
  it('should create valid cellphone', () => {
    const phone = PhoneNumber.cellphone('987654321');
    expect(phone.isCellphone()).toBe(true);
    expect(phone.formatted()).toBe('987 654 321');
  });

  it('should throw on invalid phone', () => {
    expect(() => new PhoneNumber('123')).toThrow();
    expect(() => new PhoneNumber('abcdefghi')).toThrow();
  });

  it('should clean phone number', () => {
    const phone = new PhoneNumber('(987) 654-321');
    expect(phone.value).toBe('987654321');
  });
});

describe('Address Value Object', () => {
  it('should create valid address', () => {
    const address = new Address({
      department: 'Lima',
      province: 'Lima',
      district: 'Miraflores',
      street: 'Av. Larco 123'
    });
    
    expect(address.isComplete()).toBe(true);
    expect(address.isInLima()).toBe(true);
  });

  it('should require district at minimum', () => {
    expect(() => new Address({
      department: 'Lima',
      province: 'Lima',
      district: '',
      street: 'Calle 123'
    })).toThrow();
  });

  it('should format full address correctly', () => {
    const address = new Address({
      department: 'Lima',
      province: 'Lima',
      district: 'Miraflores',
      street: 'Av. Larco 123'
    });
    
    expect(address.fullAddress()).toBe('Av. Larco 123, Miraflores, Lima, Lima');
  });
});

describe('ReportCode Value Object', () => {
  it('should create valid report code', () => {
    const code = ReportCode.fromString('RPT-2024-001');
    expect(code.value).toBe('RPT-2024-001');
  });

  it('should throw on invalid code', () => {
    expect(() => new ReportCode('')).toThrow();
    expect(() => new ReportCode('AB')).toThrow();
  });

  it('should validate alphanumeric with dashes', () => {
    expect(ReportCode.isValid('ABC-123')).toBe(true);
    expect(ReportCode.isValid('ABC_123')).toBe(false);
  });
});

console.log('✅ Tests de Value Objects listos para ejecutar');

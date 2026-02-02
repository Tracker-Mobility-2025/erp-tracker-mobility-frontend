/**
 * Tests básicos para Use Cases.
 * Valida la lógica de negocio independiente del framework.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { FetchAllReportsUseCase } from '../application/use-cases/fetch-all-reports.use-case.js';
import { FetchReportByIdUseCase } from '../application/use-cases/fetch-report-by-id.use-case.js';
import { UpdateReportUseCase } from '../application/use-cases/update-report.use-case.js';
import { UpdateLandlordInterviewUseCase } from '../application/use-cases/update-landlord-interview.use-case.js';

// Mock Repository
class MockRepository {
  constructor() {
    this.reports = [
      { reportId: 1, reportCode: 'RPT-001', finalResult: 'CONFORME' },
      { reportId: 2, reportCode: 'RPT-002', finalResult: 'OBSERVADO' }
    ];
  }

  async findAllSummaries() {
    return Promise.resolve(this.reports);
  }

  async findById(id) {
    const report = this.reports.find(r => r.reportId === id);
    return Promise.resolve(report || null);
  }

  async updateReport(command) {
    return Promise.resolve({ success: true });
  }

  async updateLandlordInterview(command) {
    return Promise.resolve({ 
      success: true,
      orderId: command.orderId,
      tenantName: command.tenantName
    });
  }
}

describe('FetchAllReportsUseCase', () => {
  let repository;
  let useCase;

  beforeEach(() => {
    repository = new MockRepository();
    useCase = new FetchAllReportsUseCase(repository, null);
  });

  it('should fetch all reports successfully', async () => {
    const result = await useCase.execute();
    
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.code).toBe('SUCCESS');
  });

  it('should return proper message with count', async () => {
    const result = await useCase.execute();
    
    expect(result.message).toContain('2 reportes cargados');
  });
});

describe('FetchReportByIdUseCase', () => {
  let repository;
  let useCase;

  beforeEach(() => {
    repository = new MockRepository();
    useCase = new FetchReportByIdUseCase(repository, null);
  });

  it('should fetch report by id successfully', async () => {
    const result = await useCase.execute(1);
    
    expect(result.success).toBe(true);
    expect(result.data.reportId).toBe(1);
    expect(result.data.reportCode).toBe('RPT-001');
  });

  it('should return NOT_FOUND for non-existent report', async () => {
    const result = await useCase.execute(999);
    
    expect(result.success).toBe(false);
    expect(result.code).toBe('NOT_FOUND');
  });

  it('should validate invalid id', async () => {
    const result = await useCase.execute('invalid');
    
    expect(result.success).toBe(false);
    expect(result.code).toBe('INVALID_PARAMS');
  });

  it('should reject negative ids', async () => {
    const result = await useCase.execute(-1);
    
    expect(result.success).toBe(false);
  });
});

describe('UpdateReportUseCase', () => {
  let repository;
  let useCase;

  beforeEach(() => {
    repository = new MockRepository();
    useCase = new UpdateReportUseCase(repository, null);
  });

  it('should update report successfully', async () => {
    const data = {
      finalResult: 'CONFORME',
      summary: 'Todo en orden',
      observations: [],
      glossary: [],
      casuistics: [],
      isResultValid: true
    };

    const result = await useCase.execute(1, data);
    
    expect(result.success).toBe(true);
  });

  it('should validate required fields', async () => {
    const data = {
      finalResult: '', // Inválido
      summary: 'Test'
    };

    const result = await useCase.execute(1, data);
    
    expect(result.success).toBe(false);
  });

  it('should validate report id', async () => {
    const data = {
      finalResult: 'CONFORME',
      summary: 'Test'
    };

    const result = await useCase.execute('invalid', data);
    
    expect(result.success).toBe(false);
    expect(result.code).toBe('INVALID_PARAMS');
  });
});

describe('UpdateLandlordInterviewUseCase', () => {
  let repository;
  let useCase;

  beforeEach(() => {
    repository = new MockRepository();
    useCase = new UpdateLandlordInterviewUseCase(repository, null);
  });

  it('should update landlord interview successfully', async () => {
    const data = {
      tenantName: 'Juan Pérez',
      ownHouse: 'Sí',
      serviceClientPays: 'Luz, Agua',
      clientPaysPunctual: 'Sí',
      clientRentalTime: '2 años',
      clientFloorNumber: '3'
    };

    const result = await useCase.execute(1, data);
    
    expect(result.success).toBe(true);
    expect(result.code).toBe('SUCCESS');
    expect(result.message).toContain('Entrevista actualizada correctamente');
  });

  it('should validate required fields', async () => {
    const data = {
      tenantName: '', // Inválido - campo requerido
      ownHouse: 'Sí',
      serviceClientPays: 'Luz',
      clientPaysPunctual: 'Sí',
      clientRentalTime: '1 año',
      clientFloorNumber: '1'
    };

    const result = await useCase.execute(1, data);
    
    expect(result.success).toBe(false);
  });

  it('should validate order id', async () => {
    const data = {
      tenantName: 'Juan Pérez',
      ownHouse: 'Sí',
      serviceClientPays: 'Luz, Agua',
      clientPaysPunctual: 'Sí',
      clientRentalTime: '2 años',
      clientFloorNumber: '3'
    };

    const result = await useCase.execute('invalid', data);
    
    expect(result.success).toBe(false);
    expect(result.code).toBe('INVALID_PARAMS');
  });

  it('should reject negative order ids', async () => {
    const data = {
      tenantName: 'Juan Pérez',
      ownHouse: 'Sí',
      serviceClientPays: 'Luz, Agua',
      clientPaysPunctual: 'Sí',
      clientRentalTime: '2 años',
      clientFloorNumber: '3'
    };

    const result = await useCase.execute(-1, data);
    
    expect(result.success).toBe(false);
    expect(result.code).toBe('INVALID_PARAMS');
  });
});

console.log('✅ Tests de Use Cases listos para ejecutar');

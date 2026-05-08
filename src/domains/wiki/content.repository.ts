/* ═══════════════════════════════════════════
   Content Repository — Stub
   Original edu-specific data access removed after domain cleanup.
   ═══════════════════════════════════════════ */

export const ContentRepository = {
  getTimeline(): readonly unknown[] { return [] },
  getTimelineLocationColors(): Readonly<Record<string, string>> { return {} },
  getTechEntries(): readonly unknown[] { return [] },
  findTechById(_id: string): unknown { return undefined },
  getIrisTimeline(): readonly unknown[] { return [] },
  getIrisAbilities(): readonly unknown[] { return [] },
  getIrisRelations(): readonly unknown[] { return [] },
  getMinaTimeline(): readonly unknown[] { return [] },
  getPlatforms(): readonly unknown[] { return [] },
  getFactionTrees(): readonly unknown[] { return [] },
  getRelationNodes(): unknown[] { return [] },
  getRelationEdges(): unknown[] { return [] },
  getEntityById(_id: string): unknown { return undefined },
  getRelationsForEntity(_id: string): unknown[] { return [] },
}

// Mermaid has shared configuration: serialize renders so theme changes cannot race.
let pending: Promise<unknown> = Promise.resolve()
let sequence = 0
export function renderWikiDiagram(source: string) {
  const render = pending.then(async () => {
    if (/%%\{|^\s*---|^\s*(?:style|classDef|linkStyle|click)\s/m.test(source)) {
      throw new Error('Use the shared wiki theme without diagram configuration or styling directives.')
    }
    const { default: mermaid } = await import('mermaid')
    const styles = getComputedStyle(document.documentElement)
    const color = (name: string) => styles.getPropertyValue(`--${name}`).trim()
    mermaid.initialize({
      startOnLoad: false, securityLevel: 'strict', theme: 'base', look: 'classic',
      suppressErrorRendering: true,
      fontFamily: styles.getPropertyValue('--sans').trim(),
      flowchart: { htmlLabels: false, curve: 'basis', useMaxWidth: false, padding: 12, rankSpacing: 36 },
      sequence: { useMaxWidth: false },
      themeVariables: {
        darkMode: document.documentElement.dataset.theme !== 'light',
        background: color('paper'), primaryColor: color('surface'),
        primaryTextColor: color('ink'), primaryBorderColor: color('terra'),
        secondaryColor: color('selected'), secondaryTextColor: color('ink'), secondaryBorderColor: color('muted'),
        tertiaryColor: color('paper'), tertiaryTextColor: color('ink'), tertiaryBorderColor: color('muted'),
        lineColor: color('muted'), textColor: color('ink'), mainBkg: color('surface'),
        nodeBorder: color('terra'), nodeTextColor: color('ink'),
        clusterBkg: color('paper'), clusterBorder: color('muted'),
        edgeLabelBackground: color('paper'), titleColor: color('ink'),
        actorBkg: color('surface'), actorBorder: color('terra'), actorTextColor: color('ink'),
        actorLineColor: color('muted'), signalColor: color('ink'), signalTextColor: color('ink'),
        labelBoxBkgColor: color('surface'), labelBoxBorderColor: color('terra'), labelTextColor: color('ink'),
        noteBkgColor: color('selected'), noteTextColor: color('ink'), noteBorderColor: color('terra'),
        fontSize: '16px',
      },
    })
    const result = await mermaid.render(`wiki-diagram-${++sequence}`, source)
    return result.svg
  })
  pending = render.catch(() => undefined)
  return render
}

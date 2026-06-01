import { Handle, Position } from '@xyflow/react'
import type { WFNodeData } from '@shared/types/electron.d'
import { useWorkflowRunStore } from '../workflowRunStore'
import BaseNode from './BaseNode'

const HANDLE_STYLE = { background: '#71717a', width: 14, height: 14, border: '2.5px solid #18181b' }

export default function WaitNode({ id, data, selected }: { id: string; data: WFNodeData; selected?: boolean }) {
  const waitState       = useWorkflowRunStore((s) => s.waitStates[id])
  const runningBranchId = useWorkflowRunStore((s) => s.runningBranchId)
  const status          = useWorkflowRunStore((s) => s.runState.status)
  const continueRun     = useWorkflowRunStore((s) => s.continueRun)

  const otherBranchRunning = runningBranchId !== null && runningBranchId !== id
  // Pre-phase: shared nodes (e.g. Generate Mesh) still running before any branch hands off.
  const inPrePhase  = status === 'running' && runningBranchId === null
  const isRunning   = waitState === 'running'
  const canContinue = (waitState === 'pending' || waitState === 'done' || waitState === 'error') && !otherBranchRunning && !inPrePhase
  const label       = waitState === 'done' ? 'Retry' : waitState === 'error' ? 'Retry' : 'Continue'

  const buttonClass = waitState === 'error'
    ? 'bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25'
    : waitState === 'done'
    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
    : 'bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25'

  const subheader = waitState ? (
    <button
      onClick={() => continueRun(id)}
      disabled={!canContinue}
      className={`nodrag w-full flex items-center justify-center gap-1.5 px-2.5 py-2 border-y transition-colors text-[10px] font-medium ${buttonClass} ${
        canContinue ? (waitState === 'pending' ? 'animate-pulse' : '') : 'opacity-40 cursor-not-allowed'
      }`}
    >
      {isRunning ? (
        <>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Running…
        </>
      ) : (
        <>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          {label}
        </>
      )}
    </button>
  ) : undefined

  const statusText =
    waitState === 'blocked' ? 'Waiting for the previous Wait to finish…' :
    waitState === 'running' ? 'Branch in progress…' :
    waitState === 'done'    ? 'Branch finished — Retry to re-run.' :
    waitState === 'error'   ? 'Branch failed — Retry to re-run.' :
    waitState === 'pending' && inPrePhase ? 'Waiting for upstream nodes…' :
    waitState === 'pending' && otherBranchRunning ? 'Another branch is running…' :
    waitState === 'pending' ? 'Workflow paused — click Continue to run this branch.' :
    'Pauses the workflow until you click Continue.'

  return (
    <BaseNode
      id={id}
      selected={selected}
      title="Wait"
      minWidth={170}
      showInGenerate={data.showInGenerate ?? false}
      icon={
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      }
      subheader={subheader}
      handles={
        <>
          <Handle type="target" position={Position.Left}  style={HANDLE_STYLE} />
          <Handle type="source" position={Position.Right} style={HANDLE_STYLE} />
        </>
      }
    >
      <div className="px-3 pb-3 pt-2.5">
        <p className="text-[10px] text-zinc-500 italic">{statusText}</p>
      </div>
    </BaseNode>
  )
}

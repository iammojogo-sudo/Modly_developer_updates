import { Handle, Position, useReactFlow } from '@xyflow/react'
import { useWorkflowRunStore } from '../workflowRunStore'
import BaseNode from './BaseNode'

const IO_COLOR = '#38bdf8'

export default function ImagePreviewNode({ id, selected }: { id: string; selected?: boolean }) {
  const nodeImageOutputs = useWorkflowRunStore((s) => s.nodeImageOutputs)
  const { getEdges }     = useReactFlow()

  const incomingEdge = getEdges().find((e) => e.target === id)
  const imageUrl     = incomingEdge ? nodeImageOutputs[incomingEdge.source] : undefined

  return (
    <BaseNode
      id={id}
      selected={selected}
      title="Preview Image"
      minWidth={180}
      icon={
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={IO_COLOR} strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      }
      subheader={
        <div className="flex items-center justify-between px-3 py-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border border-sky-500/30 bg-sky-500/10 text-sky-400">image</span>
          <span className="text-[9px] text-zinc-600">&rarr;</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border border-sky-500/30 bg-sky-500/10 text-sky-400">image</span>
        </div>
      }
      handles={
        <>
          <Handle
            type="target"
            position={Position.Left}
            style={{ background: IO_COLOR, width: 14, height: 14, border: '2.5px solid #18181b' }}
          />
          <Handle
            type="source"
            position={Position.Right}
            style={{ background: IO_COLOR, width: 14, height: 14, border: '2.5px solid #18181b' }}
          />
        </>
      }
    >
      <div className="px-2 pb-2 pt-1 flex-1 min-h-0">
        {imageUrl ? (
          <div
            className="nodrag w-full rounded overflow-hidden"
            style={{ aspectRatio: '1' }}
          >
            <img src={imageUrl} alt="preview" className="w-full h-full object-contain" />
          </div>
        ) : (
          <p className="py-3 text-center text-[10px] text-zinc-600 italic">
            Connect an image and run to preview.
          </p>
        )}
      </div>
    </BaseNode>
  )
}

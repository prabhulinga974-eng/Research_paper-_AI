import { PaperAnalysis } from "../types/paper";

export const INITIAL_MAMBA_ANALYSIS: PaperAnalysis = {
  id: "mamba-ssm-demo",
  timestamp: Date.now(),
  paperDetails: {
    title: "Mamba: Linear-Time Sequence Modeling with Selective State Spaces",
    authors: "Albert Gu, Tri Dao",
    year: "2023",
    venueOrArxiv: "arXiv:2312.00752 (COLM 2024)",
    url: "https://arxiv.org/abs/2312.00752",
    oneLineTakeaway:
      "Replaces the quadratic bottleneck of self-attention with input-dependent selective state spaces that achieve 5x higher inference throughput and linear scaling with sequence length.",
  },
  coreConcept: {
    problemStatement:
      "Standard Transformers exhibit quadratic O(N²) computational and memory complexity with respect to sequence length due to pairwise self-attention. While earlier linear-time State Space Models (SSMs) like S4 offered sub-quadratic scaling, they suffered from Linear Time-Invariant (LTI) dynamics—preventing them from selectively focusing on or filtering out context based on the current input token.",
    primaryMethodology:
      "Mamba introduces a Selective State Space mechanism where state transition parameters (Δ, B, C) are dynamic functions of the input token rather than static constants. To overcome the loss of convolution-based training parallelization inherent in time-varying recurrence, Mamba introduces a hardware-aware parallel associative scan algorithm optimized for GPU SRAM hierarchies.",
    keyBreakthroughs: [
      "Selective SSM Parameters: Matrices B, C, and step size Δ are made input-dependent (data-dependent parameterization), enabling contextual content-based filtering.",
      "Hardware-Aware Parallel Scan: Computes recurrence in GPU SRAM via parallel scan rather than slow HBM memory roundtrips, achieving speed parity with FlashAttention.",
      "Simplified Mamba Architecture: Integrates H3 state space recurrence directly with MLP blocks into a unified homogeneous neural layer without separate attention heads.",
    ],
    accessibleSynthesis:
      "Transformers are powerful because attention allows every word to interact with every other word, but this requires quadratic O(N²) compute—making long texts, genomics, and audio prohibitively expensive. Previous alternatives called State Space Models processed data in linear O(N) time like an assembly line, but treated all inputs identically without being able to remember critical tokens or ignore noise.\n\nMamba solves this with 'Selective State Spaces': it allows the model to adjust its memory state dynamically depending on what word it is reading right now. To ensure this remains fast to train, Mamba utilizes a hardware-aware GPU parallel scan that executes inside ultra-fast SRAM memory. The result is a model that runs 5x faster in inference, uses linear memory, and matches or outperforms Transformers of equal size on downstream language tasks.",
    wordCount: 148,
  },
  flowchart: {
    mermaidCode: `graph TD
  Input[Tokenized Sequence: x] --> LinearProj[Linear Projection: Expand Dimension]
  LinearProj --> Conv1D[1D Causal Convolution: Local Context]
  LinearProj --> GatingBranch[SiLU Gating Branch]
  Conv1D --> SiLUActivation[SiLU Activation]
  SiLUActivation --> SelectivityFunc[Input-Dependent Parameter Generator: Δ, B, C]
  SelectivityFunc --> Discretization[Discretization: A_bar, B_bar via Zero-Order Hold]
  Discretization --> HardwareScan[GPU Hardware-Aware Parallel Scan in SRAM]
  HardwareScan --> StateSpaceOutput[SSM Hidden State Output: y_t]
  StateSpaceOutput --> MultiplicativeGate[Multiplicative Gating x GatingBranch]
  GatingBranch --> MultiplicativeGate
  MultiplicativeGate --> OutputProjection[Linear Output Projection]
  OutputProjection --> FinalTokens[Output Hidden Representations]`,
    componentBreakdown: [
      {
        component: "Linear Expansion",
        role: "Projects input dimension d_model into expanded latent space (e.g. 2 x d_model).",
        inputsOutputs: "Input: [Batch, Length, D] → Output: [Batch, Length, 2D]",
      },
      {
        component: "1D Causal Conv & SiLU",
        role: "Captures localized n-gram token relationships prior to state space recurrence.",
        inputsOutputs: "Input: Latent sequence → Output: Convolved feature map",
      },
      {
        component: "Selective Parameter Generator",
        role: "Computes dynamic step size Δ, input matrix B, and output matrix C per token.",
        inputsOutputs: "Input: Activation vector → Output: Dynamic Δ(t), B(t), C(t)",
      },
      {
        component: "Hardware Parallel Scan",
        role: "Performs prefix-sum associative recurrence directly inside GPU SRAM cache.",
        inputsOutputs: "Input: Discretized matrices → Output: Recurrent state trajectory",
      },
      {
        component: "Multiplicative Gating",
        role: "Combines SSM recurrent representations with non-linear feedforward gate.",
        inputsOutputs: "Input: Recurrent SSM output + Gating branch → Final projection",
      },
    ],
  },
  studentOpportunities: [
    {
      id: "proj-1",
      title: "Mamba-Edge: INT8/FP8 Quantization & ONNX Edge Deployment",
      exactExtension:
        "Replace standard FP16 Mamba SSM blocks with post-training INT8 / FP8 quantized operators and compile via ONNX Runtime / TensorRT for sub-50ms token generation on consumer laptops and Raspberry Pi 5.",
      targetedMetric:
        "3.4x inference latency reduction and 65% peak VRAM reduction with less than 0.8% perplexity penalty on Wikitext-103.",
      recommendedTechStack: [
        "PyTorch",
        "HuggingFace Transformers",
        "ONNX Runtime",
        "AutoGPTQ / bitsandbytes",
      ],
      difficulty: "Intermediate",
      estimatedWeeks: 4,
      whyGreatForResume:
        "Edge ML and quantization are top hiring priorities for applied ML and software engineering roles. Demonstrates end-to-end deployment skills beyond simple notebook modeling.",
      fourWeekRoadmap: [
        {
          week: "Week 1",
          milestone: "Baseline Replication",
          tasks:
            "Clone state-spaces/mamba repo; benchmark FP16 Mamba-130M inference latency and memory footprint on CPU and GPU.",
        },
        {
          week: "Week 2",
          milestone: "Quantization Calibration",
          tasks:
            "Implement dynamic INT8 quantization for linear projections and custom calibration for the selective scan recurrence parameters.",
        },
        {
          week: "Week 3",
          milestone: "ONNX Graph Export & Kernel Tuning",
          tasks:
            "Export Mamba's associative scan graph into ONNX Runtime with fused operator execution and CPU SIMD acceleration.",
        },
        {
          week: "Week 4",
          milestone: "Ablation Suite & GitHub Portfolio",
          tasks:
            "Build an interactive Streamlit/CLI benchmark comparing Transformer vs Mamba vs Quantized-Mamba; document findings in a clean GitHub README.",
        },
      ],
      resumeBulletSTAR:
        "Engineered an INT8 quantized edge deployment pipeline for Mamba State-Space Models using PyTorch and ONNX Runtime, slashing inference memory by 65% and boosting token throughput 3.4x on low-power devices with <1% accuracy loss.",
      starterCodeSnippet: `import torch
import torch.nn as nn
from mamba_ssm import Mamba

# Quantization starter wrapper for Mamba layer
class QuantizedMambaBlock(nn.Module):
    def __init__(self, d_model=768, d_state=16):
        super().__init__()
        self.mamba = Mamba(d_model=d_model, d_state=d_state)
        # Apply dynamic int8 quantization on linear sub-modules
        self.quantized_mamba = torch.ao.quantization.quantize_dynamic(
            self.mamba, {nn.Linear}, dtype=torch.qint8
        )

    def forward(self, x):
        # x: [batch, seq_len, d_model]
        return self.quantized_mamba(x)

# Test latency
model = QuantizedMambaBlock().eval()
dummy_input = torch.randn(1, 512, 768)
with torch.no_grad():
    out = model(dummy_input)
print("Quantized Mamba Output shape:", out.shape)`,
    },
    {
      id: "proj-2",
      title: "Hybrid Mamba-Attention Architecture for Long-Context Code Retrieval",
      exactExtension:
        "Build a hybrid interleaving architecture (4 Mamba blocks followed by 1 sliding-window Multi-Head Attention layer) to evaluate needle-in-a-haystack retrieval over 32k code repository context windows.",
      targetedMetric:
        "2.8x faster training throughput compared to pure CodeLlama with 94%+ retrieval accuracy on Passkey / Needle retrieval benchmarks at 32k tokens.",
      recommendedTechStack: [
        "PyTorch",
        "FlashAttention-2",
        "DeepSpeed / Accelerate",
        "Weights & Biases",
      ],
      difficulty: "Challenging",
      estimatedWeeks: 4,
      whyGreatForResume:
        "Shows architectural intuition—understanding where pure SSMs struggle (exact associative recall across long distances) and synthesizing hybrid paradigms.",
      fourWeekRoadmap: [
        {
          week: "Week 1",
          milestone: "Hybrid Module Design",
          tasks:
            "Design a PyTorch Module interleaving N Mamba layers with 1 FlashAttention layer with matching residual dimensions.",
        },
        {
          week: "Week 2",
          milestone: "Pre-training on The Stack Subset",
          tasks:
            "Pretrain a 150M parameter hybrid model on a 5GB subset of Python code repositories using PyTorch Lightning or HuggingFace Accelerate.",
        },
        {
          week: "Week 3",
          milestone: "Synthetic Long-Context Benchmarks",
          tasks:
            "Implement synthetic retrieval stress-tests: Needle-in-a-Haystack, multi-hop variable tracing, and function call resolution up to 32k context.",
        },
        {
          week: "Week 4",
          milestone: "Paper Write-up & Open Source Weights",
          tasks:
            "Publish checkpoint weights to Hugging Face Hub, generate comparative loss curves, and write a technical blog post breakdown.",
        },
      ],
      resumeBulletSTAR:
        "Architected a hybrid Mamba-Transformer neural network for 32k-token code reasoning, reducing training memory by 58% while matching full attention baseline on needle-in-a-haystack retrieval benchmarks.",
      starterCodeSnippet: `import torch
import torch.nn as nn
from mamba_ssm import Mamba

class HybridMambaAttentionLayer(nn.Module):
    def __init__(self, d_model=512, n_heads=8, mamba_ratio=4):
        super().__init__()
        self.mamba_blocks = nn.ModuleList([
            Mamba(d_model=d_model, d_state=16) for _ in range(mamba_ratio)
        ])
        self.attention = nn.MultiheadAttention(d_model, n_heads, batch_first=True)
        self.norm = nn.LayerNorm(d_model)

    def forward(self, x):
        # Pass sequentially through selective SSM blocks
        for block in self.mamba_blocks:
            x = x + block(self.norm(x))
        # Periodic attention block for associative lookup
        attn_out, _ = self.attention(x, x, x)
        return x + attn_out`,
    },
    {
      id: "proj-3",
      title: "Streaming Mamba for Real-Time Audio / Biosignal Anomaly Detection",
      exactExtension:
        "Adapt Mamba's recurrent inference formulation to process continuous streaming ECG / EEG time-series sensor data on microcontrollers without needing sequence buffering.",
      targetedMetric:
        "Constant O(1) memory per timestep with <5ms inference latency per sensor window and 96.2% F1-score on PhysioNet MIT-BIH Arrhythmia dataset.",
      recommendedTechStack: [
        "PyTorch",
        "TorchScript / TinyML",
        "NumPy / SciPy",
        "Matplotlib",
      ],
      difficulty: "Intermediate",
      estimatedWeeks: 4,
      whyGreatForResume:
        "Crosses CS AI with embedded IoT systems and healthcare diagnostics, demonstrating versatility and understanding of recurrent O(1) state updating.",
      fourWeekRoadmap: [
        {
          week: "Week 1",
          milestone: "Dataset Ingestion & Baseline RNN",
          tasks:
            "Download PhysioNet MIT-BIH dataset, normalize continuous lead signals, and benchmark baseline LSTM / GRU.",
        },
        {
          week: "Week 2",
          milestone: "Continuous 1D Mamba Adaptation",
          tasks:
            "Modify Mamba tokenization to ingest raw 1D continuous voltage floats rather than discrete token embeddings.",
        },
        {
          week: "Week 3",
          milestone: "Streaming Recurrence Mode",
          tasks:
            "Implement step-by-step state recurrence `step(x_t, state)` simulating a real-time IoT continuous streaming loop.",
        },
        {
          week: "Week 4",
          milestone: "Micro-Benchmarking & Demo App",
          tasks:
            "Create a live simulated sensor monitor with real-time waveform anomaly alerts running purely on CPU.",
        },
      ],
      resumeBulletSTAR:
        "Developed a real-time streaming biosignal anomaly detection system leveraging Selective State Space Models, achieving constant O(1) memory consumption and sub-5ms step latency on continuous ECG streams with a 96.2% F1-score.",
      starterCodeSnippet: `import torch
import torch.nn as nn

# Streaming step evaluation prototype
class StreamingSSMDetector(nn.Module):
    def __init__(self, in_features=1, hidden_dim=64, state_dim=16):
        super().__init__()
        self.proj_in = nn.Linear(in_features, hidden_dim)
        self.classifier = nn.Linear(hidden_dim, 2) # Normal vs Anomaly
        # State dimension per channel
        self.state_dim = state_dim
        self.hidden_dim = hidden_dim

    def init_state(self, batch_size=1, device="cpu"):
        return torch.zeros(batch_size, self.hidden_dim, self.state_dim, device=device)

    def step(self, x_t, prev_state):
        # x_t: single sample [batch, 1]
        h = self.proj_in(x_t)
        # Dynamic update step (mocking discrete selective recurrence)
        next_state = 0.9 * prev_state + torch.randn_like(prev_state) * 0.05
        logits = self.classifier(h)
        return logits, next_state`,
    },
  ],
  tokenEfficiencyBadge: {
    estimatedAnalysisTokens: 2450,
    maxTokenBudget: 25000,
    budgetAdherence: "Strictly under 25,000 token limit",
  },
  usage: {
    promptTokenCount: 1680,
    candidatesTokenCount: 1820,
    totalTokenCount: 3500,
  },
};

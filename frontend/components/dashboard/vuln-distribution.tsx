type VulnData = {
  critical: number;
  high: number;
  medium: number;
  low: number;
};

type Props = {
  sast: VulnData;
  sca: VulnData;
  gitleaks: number;
};

export function VulnDistribution({
  sast,
  sca,
  gitleaks,
}: Props) {

  const critical =
    sast.critical +
    sca.critical +
    gitleaks;

  const high =
    sast.high +
    sca.high;

  const medium =
    sast.medium +
    sca.medium;

  const low =
    sast.low +
    sca.low;

  const total =
    critical +
    high +
    medium +
    low;

  return (

    <div className="bg-white/5 p-6 rounded-xl border border-white/10">

      <h2 className="text-lg font-semibold mb-6 text-cyan-400">
        Vulnerability Distribution
      </h2>


      <div className="space-y-4">

        <div className="flex justify-between">
          <span className="text-red-400">
            Critical
          </span>

          <span className="font-bold">
            {critical}
          </span>
        </div>


        <div className="flex justify-between">
          <span className="text-orange-400">
            High
          </span>

          <span className="font-bold">
            {high}
          </span>
        </div>


        <div className="flex justify-between">
          <span className="text-yellow-400">
            Medium
          </span>

          <span className="font-bold">
            {medium}
          </span>
        </div>


        <div className="flex justify-between">
          <span className="text-green-400">
            Low
          </span>

          <span className="font-bold">
            {low}
          </span>
        </div>


        <div className="pt-4 border-t border-white/10 flex justify-between">

          <span className="text-cyan-400 font-medium">
            Total Issues
          </span>

          <span className="text-xl font-bold text-cyan-400">
            {total}
          </span>

        </div>

      </div>

    </div>

  );
}
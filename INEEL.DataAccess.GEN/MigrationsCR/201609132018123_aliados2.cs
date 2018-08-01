namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class aliados2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_ActividadAdicional", "AliadoId", c => c.Int(nullable: false));
            AddColumn("CR.tab_AdjuntoPorConvenio", "AdjuntoId", c => c.Long(nullable: false));
            AddColumn("CR.tab_AdjuntoPorConvenio", "ConvenioId", c => c.Int(nullable: false));
            AddColumn("CR.tab_AreaActividadAdicional", "ActividadAdicionalId", c => c.Int(nullable: false));
            AddColumn("CR.tab_AreaConvenio", "ConvenioId", c => c.Int(nullable: false));
            AddColumn("CR.tab_Convenio", "TipoConvenioId", c => c.Int(nullable: false));
            AddColumn("CR.tab_Convenio", "AliadoId", c => c.Int(nullable: false));
            AddColumn("CR.tab_PersonalActividadAdicional", "ActividadAdicionalId", c => c.Int(nullable: false));
            CreateIndex("CR.tab_ActividadAdicional", "AliadoId");
            CreateIndex("CR.tab_Convenio", "TipoConvenioId");
            CreateIndex("CR.tab_Convenio", "AliadoId");
            CreateIndex("CR.tab_AdjuntoPorConvenio", "AdjuntoId");
            CreateIndex("CR.tab_AdjuntoPorConvenio", "ConvenioId");
            CreateIndex("CR.tab_AreaConvenio", "ConvenioId");
            CreateIndex("CR.tab_AreaActividadAdicional", "ActividadAdicionalId");
            CreateIndex("CR.tab_PersonalActividadAdicional", "ActividadAdicionalId");
            AddForeignKey("CR.tab_AdjuntoPorConvenio", "AdjuntoId", "GEN.Adjunto", "AdjuntoId", cascadeDelete: false);
            AddForeignKey("CR.tab_AdjuntoPorConvenio", "ConvenioId", "CR.tab_Convenio", "ConvenioId", cascadeDelete: false);
            AddForeignKey("CR.tab_Convenio", "AliadoId", "CR.tab_Aliado", "AliadoId", cascadeDelete: false);
            AddForeignKey("CR.tab_AreaConvenio", "ConvenioId", "CR.tab_Convenio", "ConvenioId", cascadeDelete: false);
            AddForeignKey("CR.tab_Convenio", "TipoConvenioId", "CR.cat_TipoConvenio", "ConvenioId", cascadeDelete: false);
            AddForeignKey("CR.tab_ActividadAdicional", "AliadoId", "CR.tab_Aliado", "AliadoId", cascadeDelete: false);
            AddForeignKey("CR.tab_AreaActividadAdicional", "ActividadAdicionalId", "CR.tab_ActividadAdicional", "ActividadAdicionalId", cascadeDelete: false);
            AddForeignKey("CR.tab_PersonalActividadAdicional", "ActividadAdicionalId", "CR.tab_ActividadAdicional", "ActividadAdicionalId", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_PersonalActividadAdicional", "ActividadAdicionalId", "CR.tab_ActividadAdicional");
            DropForeignKey("CR.tab_AreaActividadAdicional", "ActividadAdicionalId", "CR.tab_ActividadAdicional");
            DropForeignKey("CR.tab_ActividadAdicional", "AliadoId", "CR.tab_Aliado");
            DropForeignKey("CR.tab_Convenio", "TipoConvenioId", "CR.cat_TipoConvenio");
            DropForeignKey("CR.tab_AreaConvenio", "ConvenioId", "CR.tab_Convenio");
            DropForeignKey("CR.tab_Convenio", "AliadoId", "CR.tab_Aliado");
            DropForeignKey("CR.tab_AdjuntoPorConvenio", "ConvenioId", "CR.tab_Convenio");
            DropForeignKey("CR.tab_AdjuntoPorConvenio", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CR.tab_PersonalActividadAdicional", new[] { "ActividadAdicionalId" });
            DropIndex("CR.tab_AreaActividadAdicional", new[] { "ActividadAdicionalId" });
            DropIndex("CR.tab_AreaConvenio", new[] { "ConvenioId" });
            DropIndex("CR.tab_AdjuntoPorConvenio", new[] { "ConvenioId" });
            DropIndex("CR.tab_AdjuntoPorConvenio", new[] { "AdjuntoId" });
            DropIndex("CR.tab_Convenio", new[] { "AliadoId" });
            DropIndex("CR.tab_Convenio", new[] { "TipoConvenioId" });
            DropIndex("CR.tab_ActividadAdicional", new[] { "AliadoId" });
            DropColumn("CR.tab_PersonalActividadAdicional", "ActividadAdicionalId");
            DropColumn("CR.tab_Convenio", "AliadoId");
            DropColumn("CR.tab_Convenio", "TipoConvenioId");
            DropColumn("CR.tab_AreaConvenio", "ConvenioId");
            DropColumn("CR.tab_AreaActividadAdicional", "ActividadAdicionalId");
            DropColumn("CR.tab_AdjuntoPorConvenio", "ConvenioId");
            DropColumn("CR.tab_AdjuntoPorConvenio", "AdjuntoId");
            DropColumn("CR.tab_ActividadAdicional", "AliadoId");
        }
    }
}

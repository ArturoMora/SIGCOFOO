namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CampoIdValidacionEnDetalleEvalacionTEC : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_DetalleEvaluacionTecnicas", "idEvaluacion", c => c.Int(nullable: false));
            AlterColumn("CH.cat_TipoArea", "Area", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("CH.cat_TipoArea", "Area", c => c.String(maxLength: 20));
            DropColumn("CH.tab_DetalleEvaluacionTecnicas", "idEvaluacion");
        }
    }
}

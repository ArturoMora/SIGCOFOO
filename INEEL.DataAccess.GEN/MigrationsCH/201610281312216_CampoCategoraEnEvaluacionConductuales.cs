namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CampoCategoraEnEvaluacionConductuales : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_EvaluacionConductuales", "CategoriaNomina", c => c.String(maxLength: 100));
            DropColumn("CH.tab_EvaluacionConductuales", "Categoria");
        }
        
        public override void Down()
        {
            AddColumn("CH.tab_EvaluacionConductuales", "Categoria", c => c.String(maxLength: 100));
            DropColumn("CH.tab_EvaluacionConductuales", "CategoriaNomina");
        }
    }
}

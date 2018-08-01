namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class agregaCampoOrdenamientoTipoPI : DbMigration
    {
        public override void Up()
        {
            AddColumn("PI.cat_TipoPropiedadIndustrial", "prioridadOrdenamiento", c => c.Int(nullable: true));
        }
        
        public override void Down()
        {
            DropColumn("PI.cat_TipoPropiedadIndustrial", "prioridadOrdenamiento");
        }
    }
}

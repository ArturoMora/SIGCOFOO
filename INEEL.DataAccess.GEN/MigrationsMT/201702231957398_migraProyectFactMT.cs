namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraProyectFactMT : DbMigration
    {
        public override void Up()
        {
            //AddColumn("GEN.Proyectos", "FacturacionPlaneada", c => c.Decimal(precision: 18, scale: 2));
            //AddColumn("GEN.Proyectos", "FacturacionReal", c => c.Decimal(precision: 18, scale: 2));
        }
        
        public override void Down()
        {
            //DropColumn("GEN.Proyectos", "FacturacionReal");
            //DropColumn("GEN.Proyectos", "FacturacionPlaneada");
        }
    }
}
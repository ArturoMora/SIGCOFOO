namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class s : DbMigration
    {
        public override void Up()
        {
            //AddColumn("GEN.cat_Funciones", "ClaseIcono", c => c.String());
            //DropColumn("GEN.cat_EstadoFlujo", "FechaEfectiva");
        }
        
        public override void Down()
        {
            //AddColumn("GEN.cat_EstadoFlujo", "FechaEfectiva", c => c.DateTime(nullable: false));
            //DropColumn("GEN.cat_Funciones", "ClaseIcono");
        }
    }
}

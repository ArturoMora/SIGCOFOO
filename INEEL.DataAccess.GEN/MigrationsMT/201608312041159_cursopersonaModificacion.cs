namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cursopersonaModificacion : DbMigration
    {
        public override void Up()
        {
            AddColumn("MT.CursosPersonal", "FechaValidacion", c => c.DateTime());
            AddColumn("MT.CursosPersonal", "EstadoFlujoId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("MT.CursosPersonal", "EstadoFlujoId");
            DropColumn("MT.CursosPersonal", "FechaValidacion");
        }
    }
}

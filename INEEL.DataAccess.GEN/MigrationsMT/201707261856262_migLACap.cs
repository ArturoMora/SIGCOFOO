namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migLACap : DbMigration
    {
        public override void Up()
        {
            AlterColumn("MT.ITFLeccionesAprendidasCapacidad", "Instalaciones", c => c.String(maxLength: 500));
            AlterColumn("MT.ITFLeccionesAprendidasCapacidad", "Servicios", c => c.String(maxLength: 500));
        }
        
        public override void Down()
        {
            AlterColumn("MT.ITFLeccionesAprendidasCapacidad", "Servicios", c => c.String(nullable: false, maxLength: 500));
            AlterColumn("MT.ITFLeccionesAprendidasCapacidad", "Instalaciones", c => c.String(nullable: false, maxLength: 500));
        }
    }
}

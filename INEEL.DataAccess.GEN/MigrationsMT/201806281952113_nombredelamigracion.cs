namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class nombredelamigracion : DbMigration
    {
        public override void Up()
        {
            //AddColumn("MT.SoftwarePersonal", "ObservacionesDerechoAutor", c => c.String(unicode: false));
            //DropColumn("MT.SoftwarePersonal", "DerechoAutor");
        }
        
        public override void Down()
        {
            //AddColumn("MT.SoftwarePersonal", "DerechoAutor", c => c.String(unicode: false));
            //DropColumn("MT.SoftwarePersonal", "ObservacionesDerechoAutor");
        }
    }
}
